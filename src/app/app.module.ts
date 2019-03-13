import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
/** ngrx */
import {EffectsModule} from '@ngrx/effects';
import {select, Store, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {filter, first, tap} from 'rxjs/operators';

import {EVENTOS_EXISTENTES} from '../data/eventos';
import * as fromStore from '../store';
import * as fromGeralFeature from '../store/geral';
import {effects} from '../store/geral/effects';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {AuthGuardModule} from './auth/guards/auth-guard.module';
import {CustomMaterialModule} from './custom-material.module';
import {
  ServicosSingletonModule,
} from './model/servicos/servicos-singleton.module';
import {ServicosModule} from './model/servicos/servicos.module';
import * as fromDocuments from './model/transport-objects';

import {OcorrenciasPessoasAdapterService} from './ocorrencias-pessoas.service';
import {PESSOAS_SERVICE_ADAPTER} from './ocorrencias/public_api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    HttpClientModule,
    AuthModule.forRoot(),
    AuthGuardModule.forRoot(),
    ServicosModule,
    ServicosSingletonModule.forRoot(),
    AppRoutingModule,

    /** ngrx */
    StoreModule.forRoot(fromGeralFeature.REDUCERS.geralReducers),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 10,
    }),
  ],
  providers: [
    {
      provide: PESSOAS_SERVICE_ADAPTER,
      useExisting: OcorrenciasPessoasAdapterService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private _store$: Store<{}>) {
    this._fixEventos();
    this._store$.dispatch(
        new fromStore.GERAL.ACTIONS.ObtemDadosDoUsuarioLogadoRun());
    this._store$.dispatch(
        new fromStore.GERAL.ACTIONS.ObtemTutoriasDoUsuarioLogadoRun());
    this._store$.dispatch(new fromStore.GERAL.ACTIONS.ObtemConfigRun());
    this._store$.dispatch(
        new fromStore.GERAL.ACTIONS.ObtemUnidadesDisponiveisRun());
    this._store$.pipe(select(fromStore.GERAL.SELECTORS.CONFIGURACOES_GERAIS
                                 .getSemestreDeTrabalho),
                      filter(Boolean), first(),
                      tap((s: fromDocuments.SemestreDeTrabalho) =>
                              this._store$.dispatch(
                                  new fromStore.GERAL.ACTIONS
                                      .ObtemDatasDeEntregaDisponiveisRun({
                                        ano: s.ano,
                                        semestre: s.semestre,
                                      }))))
        .subscribe();
    this._store$.dispatch(new fromStore.GERAL.ACTIONS.ObtemHoraDoServidorRun());
  }

  _fixEventos(): void {
    EVENTOS_EXISTENTES.forEach((evt: fromDocuments.Evento) => {
      if (evt.tutoria.historicoTutores.length) {
        evt.tutoria.historicoTutores.sort((a, b) =>
                                              new Date(b.dataInicio).getTime() -
                                              new Date(a.dataInicio).getTime());
      }

      evt.visibilidade = {
        tipo: fromDocuments.TipoVisibilidade.SOMENTE_PARTICIPANTES,
      };

      evt.textoFormatado = {
        html: evt.parecer,
        markdown: evt.parecer,
        semFormatacao: evt.parecer,
      };

      evt.cidadeUnidade =
          `${evt.tutoria.unidade.cidade}:${evt.tutoria.unidade.unidade}`;

      const tutor = evt.tutoria.historicoTutores[0];

      const titulo =
          evt.parecer.split(' ').splice(0, 20).filter(Boolean).join(' ') +
          '...';

      evt.interacoes =
          evt.etapas
              .map((etapa: fromDocuments.Etapa): fromDocuments.Interacao => ({
                     tipoInteracao: fromDocuments.TipoInteracao.COMENTARIO,
                     autorRef: {
                       code: etapa.emailResponsavel,
                       description: etapa.emailResponsavel,
                     },
                     role: etapa.tipoEtapa,
                     dataCriacao: new Date(etapa.dataFim),
                     historicoInteracoes: [
                       {
                         data: etapa.dataFim,
                         texto: {
                           semFormatacao: etapa.parecer,
                           markdown: etapa.parecer,
                         },
                       },
                     ],
                     id: '' + new Date().getTime() + Math.random(),
                     visibilidade: {
                       tipo: fromDocuments.TipoVisibilidade.TODOS,
                     },
                   }))
              .sort((a, b) => new Date(a.dataCriacao).getTime() -
                              new Date(b.dataCriacao).getTime());

      if (evt.isResolvido) {
        const acao: fromDocuments.Interacao = {
          tipoInteracao: fromDocuments.TipoInteracao.ACAO,
          dataCriacao: evt.lasModifiedDate,
          autorRef:
              evt.interacoes && evt.interacoes.length ?
                  evt.interacoes[evt.interacoes.length - 1].autorRef :
                  {
                    code: evt.tutoria.historicoTutores.find((t) => !t.dataFim)
                              .email,
                    description:
                        evt.tutoria.historicoTutores.find((t) => !t.dataFim)
                            .nomeTutor,
                  },
          id: '' + new Date().getTime(),
          role: evt.interacoes && evt.interacoes.length ?
                    evt.interacoes[evt.interacoes.length - 1].role :
                    fromDocuments.TipoParticipacao.COORDENADOR,
          historicoInteracoes: [
            {
              data: evt.lasModifiedDate,
              tipoAcao: fromDocuments.TipoAcao.ENCERRA_OCORRENCIA,
            },
          ],
        };

        evt.interacoes.push(acao);
      }

      evt.classificacaoEvento = fromDocuments.ClassificacaoEvento.TUTORIA_TUTOR;

      evt.titulo = titulo;

      evt.autorEvento = tutor ?
                            {
                              code: tutor.email,
                              description: tutor.nomeTutor,
                            } :
                            null;

      evt.participantes = evt.etapas.map(
          (etapa: fromDocuments.Etapa) => ({
            usuarioRef: {
              code: etapa.emailResponsavel,
              description: etapa.emailResponsavel,
            },
            tipoParticipacao: etapa.tipoEtapa as fromDocuments.TipoParticipacao,
            isAutor: evt.autorEvento.code === etapa.emailResponsavel,
          }));

      evt.participantes.push({
        usuarioRef: {...evt.autorEvento},
        isAutor: true,
        tipoParticipacao: fromDocuments.TipoParticipacao.TUTOR,
      });
    });
  }
}
