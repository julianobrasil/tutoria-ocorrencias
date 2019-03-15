// tslint:disable:max-line-length
import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import {AuthService} from '../../../app/auth/auth.service';
import {
  EventoRestService,
} from '../../../app/model/servicos/dao/evento-rest.service';
import {ImodbService} from '../../../app/model/servicos/imodb.service';
import {
  Evento,
  EventoPaginado,
  NovoEventoRequest,
  TipoEvento,
} from '../../../app/model/transport-objects/';
import {
  OcorrenciaStatusGravacaoService,
} from '../../../app/ocorrencias/ocorrencia-status-gravacao.service';
import * as fromActions from '../actions/evento.action';

import {OcorrenciaChangeType} from '../../../../src/app/ocorrencias/public_api';
// tslint:disable:max-line-length

@Injectable({
  providedIn: 'root',
})
export class EventoEffects {
  constructor(private _actions$: Actions, private _authService: AuthService,
              private _ocorrenciaStatusGravacaoService:
                  OcorrenciaStatusGravacaoService,
              private _eventoService: EventoRestService,
              private _imodbService: ImodbService,
              private _route: ActivatedRoute, private _router: Router) {}

  @Effect()
  obtemEventos$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_EVENTOS_PAGINADOS.RUN),
      switchMap(
          (action: fromActions.ObtemEventosPaginadosRun) =>
              this._eventoService.findEventosByUsuarioLogado(
                                     action.payload.termoDeBusca,
                                     action.payload.paginacao &&
                                         action.payload.paginacao.page?
                                         action.payload.paginacao.page: 0,
                                     action.payload.paginacao &&
                                         action.payload.paginacao.pageSize?
                                         action.payload.paginacao.pageSize: 10)
                  .pipe(catchError(
                      () => observableOf({content: [], totalElements: 0})))),
      map((pagina: | EventoPaginado |
           {
             content: any[];
             totalElements: number;
           }) => new fromActions.ObtemEventosPaginadosSuccess({
        eventos: pagina.content,
        totalElements: pagina.totalElements,
      })));

  @Effect()
  obtemTiposEventos$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_TIPOS_EVENTOS.RUN),
      switchMap(() => observableOf(this._imodbService.tipos)),
      map((tiposEventos: TipoEvento[]) =>
              new fromActions.ObtemTiposDeEventosSuccess({tiposEventos})));

  @Effect()
  obtemEventoById$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_EVENTO_POR_ID.RUN),
      switchMap((action: fromActions.ObtemEventoPorIdRun) =>
                    this._eventoService.findEventoById(action.payload.id)
                        .pipe(catchError((e) => observableOf(e)))),
      map((evento: Evento | string) =>
              typeof evento ===
              'string'? new fromActions.ObtemEventoPorIdFail(
                                           {error: '', eventoId: evento}):
                  new fromActions.ObtemEventoPorIdSuccess({evento})));

  @Effect()
  alteraTipoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_TIPO_EVENTO.RUN),
      switchMap((action: fromActions.AlteraTipoDeEventoRun) =>
                    this._eventoService.alteraTipoDeEvento(
                        action.payload.eventoId,
                        action.payload.descricaoTipoEvento,
                        action.payload.descricaoSubTipoEvento)),
      map((evento: Evento) =>
              new fromActions.AlteraTipoDeEventoSuccess({evento})));

  @Effect({dispatch: false})
  excluiEvento$ = this._actions$.pipe(
      ofType(fromActions.EXCLUI_EVENTO.RUN),
      switchMap((action: fromActions.ExcluiEventoRun) =>
                    this._eventoService.removeEvento(action.payload.eventoId)),
      tap(() => this._router.navigate(['../'], {relativeTo: this._route})));

  @Effect()
  reabreEvento$ = this._actions$.pipe(
      ofType(fromActions.REABRE_EVENTO.RUN),
      switchMap(
          (action: fromActions.ReabreEventoRun) =>
              this._eventoService.reabreEvento(
                  action.payload.eventoId, action.payload.textoComentario?
                                           action.payload.textoComentario: '')),
      tap((evento: Evento) =>
              this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                sucesso: true,
                operacaoExecutada: OcorrenciaChangeType.REABRE_E_COMENTA,
              })),
      map((evento: Evento) => new fromActions.ReabreEventoSuccess({evento})));

  @Effect()
  encerraEvento$ = this._actions$.pipe(
      ofType(fromActions.ENCERRA_EVENTO.RUN),
      switchMap(
          (action: fromActions.EncerraEventoRun) =>
              this._eventoService.encerraEvento(
                  action.payload.eventoId, action.payload.textoComentario?
                                           action.payload.textoComentario: '')),
      tap((evento: Evento) =>
              this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                sucesso: true,
                operacaoExecutada: OcorrenciaChangeType.ENCERRA_E_COMENTA,
              })),
      map((evento: Evento) => new fromActions.EncerraEventoSuccess({evento})));

  @Effect()
  insereComentario$ = this._actions$.pipe(
      ofType(fromActions.INSERE_COMENTARIO_EVENTO.RUN),
      switchMap(
          (action: fromActions.InsereComentarioRun) =>
              this._eventoService.insereComentario(
                                     action.payload.eventoId,
                                     action.payload.textoComentario,
                                     action.payload.visibilidade)
                  .pipe(catchError((e: any) => {
                    this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                      sucesso: false,
                      operacaoExecutada: OcorrenciaChangeType.COMENTA,
                    });
                    return observableOf(null);
                  }))),
      tap((evento: Evento | null) =>
              evento?
              this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                sucesso: true,
                operacaoExecutada: OcorrenciaChangeType.COMENTA,
              }): null),
      map((evento: Evento | null) =>
              evento? new fromActions.InsereComentarioSuccess({evento}):
                  new fromActions.InsereComentarioFail({error: null})));

  @Effect()
  excluiComentario$ = this._actions$.pipe(
      ofType(fromActions.EXCLUI_INTERACAO_EVENTO.RUN),
      switchMap(
          (action: fromActions.ExcluiInteracaoDoEventoRun) =>
              this._eventoService.excluiInteracao(action.payload.eventoId,
                                                  action.payload.interacaoId)
                  .pipe(catchError((e: any) => {
                    this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                      sucesso: false,
                      operacaoExecutada: OcorrenciaChangeType.EXCLUI_COMENTARIO,
                    });
                    return observableOf(null);
                  }))),
      tap((evento: Evento | null) =>
              evento?
              this._ocorrenciaStatusGravacaoService.statusGravacao$.next({
                sucesso: true,
                operacaoExecutada: OcorrenciaChangeType.EXCLUI_COMENTARIO,
              }): null),
      map((evento: Evento | null) =>
              evento? new fromActions.ExcluiInteracaoDoEventoSuccess({evento}):
                  new fromActions.ExcluiInteracaoDoEventoFail({error: null})));

  @Effect()
  criaEvento$ = this._actions$.pipe(
      ofType(fromActions.CRIA_EVENTO.RUN),
      switchMap(
          (action: fromActions.CriaEventoRun) =>
              this._eventoService.criaEvento(action.payload.novoEventoRequest)
                  .pipe(catchError((error: NovoEventoRequest) =>
                                       observableOf(error)))),
      tap((item: Evento | NovoEventoRequest) =>
              item.hasOwnProperty('tipoEventoId')?
              this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.NOVO_EVENTO,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.NOVO_EVENTO,
                    evento: item as Evento,
                  })),
      map((item: Evento | NovoEventoRequest) =>
              item.hasOwnProperty('tipoEventoId')?
              new fromActions.CriaEventoFail({error: item}):
                  new fromActions.CriaEventoSuccess({evento: item as Evento})));

  @Effect()
  alteraLocalEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_LOCAL_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraLocalDoEventoRun) =>
              this._eventoService.alteraLocalDoEvento(action.payload.eventoId,
                                                      action.payload.local)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_LOCAL,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_LOCAL,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraLocalDoEventoSuccess({evento})));

  @Effect()
  alteraUnidadeEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_UNIDADE_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraUnidadeDoEventoRun) =>
              this._eventoService.alteraUnidadeDoEvento(action.payload.eventoId,
                                                        action.payload.unidade)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_UNIDADE,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_UNIDADE,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraUnidadeDoEventoSuccess({evento})));

  @Effect()
  alteraTituloEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_TITULO_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraTituloDoEventoRun) =>
              this._eventoService.alteraTituloDoEvento(action.payload.eventoId,
                                                       action.payload.titulo)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_TITULO,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_TITULO,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraTituloDoEventoSuccess({evento})));

  @Effect()
  alteraVisibilidadeDaInteracao$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_VISIBILIDADE_DA_INTERACAO.RUN),
      switchMap((action: fromActions.AlteraVisibilidadeDaInteracaoRun) =>
                    this._eventoService.alteraVisibilidadeDaInteracao(
                                           action.payload.eventoId,
                                           action.payload.interacaoId,
                                           action.payload.visibilidade)
                        .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada:
                        OcorrenciaChangeType.VISIBILIDADE_COMENTARIO,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada:
                        OcorrenciaChangeType.VISIBILIDADE_COMENTARIO,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraVisibilidadeDaInteracaoSuccess({evento})));

  @Effect()
  alteraVisibilidadeDoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_VISIBILIDADE_DO_EVENTO.RUN),
      switchMap((action: fromActions.AlteraVisibilidadeDoEventoRun) =>
                    this._eventoService.alteraVisibilidadeDoEvento(
                                           action.payload.eventoId,
                                           action.payload.visibilidade)
                        .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.VISIBILIDADE_EVENTO,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.VISIBILIDADE_EVENTO,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraVisibilidadeDaInteracaoSuccess({evento})));

  @Effect()
  alteraTextoDeComentario$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_TEXTO_DE_COMENTARIO.RUN),
      switchMap((action: fromActions.AlteraTextoDeComentarioRun) =>
                    this._eventoService.alteraTextoDeComentario(
                                           action.payload.eventoId,
                                           action.payload.interacaoId,
                                           action.payload.textoFormatado)
                        .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.TEXTO_COMENTARIO,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.TEXTO_COMENTARIO,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraTextoDeComentarioSuccess({evento})));

  @Effect()
  alteraParecerDoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_PARECER_DO_EVENTO.RUN),
      switchMap((action: fromActions.AlteraParecerDoEventoRun) =>
                    this._eventoService.alteraParecerDoEvento(
                                           action.payload.eventoId,
                                           action.payload.textoFormatado)
                        .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_PARECER,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_PARECER,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraParecerDoEventoSuccess({evento})));

  @Effect()
  alteraParticipantesDoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_PARTICIPANTES_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraParticipantesDoEventoRun) =>
              this._eventoService.alteraParticipantesDoEvento(
                                     action.payload.eventoId,
                                     action.payload.participantesAdicionados,
                                     action.payload.participantesRemovidos)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada:
                        OcorrenciaChangeType.ALTERA_PARTICIPANTES,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada:
                        OcorrenciaChangeType.ALTERA_PARTICIPANTES,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraParticipantesDoEventoSuccess({evento})));

  @Effect()
  alterarResponsaveisDoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_RESPONSAVEIS_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraResponsaveisDoEventoRun) =>
              this._eventoService.alteraResponsaveisDoEvento(
                                     action.payload.eventoId,
                                     action.payload.participantesAdicionados,
                                     action.payload.participantesRemovidos)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_RESPONSAVEIS,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_RESPONSAVEIS,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraResponsaveisDoEventoSuccess({evento})));

  @Effect()
  alterarRotulosDoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_ROTULOS_DO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraRotulosDoEventoRun) =>
              this._eventoService.alteraRotulosDoEvento(
                                     action.payload.eventoId,
                                     action.payload.rotulosAdicionadosIds,
                                     action.payload.rotulosRemovidosIds)
                  .pipe(catchError((e) => observableOf('erro')))),
      tap((item: Evento | string) =>
              typeof item ===
              'string'? this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: false,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_ROTULOS,
                  }): this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaChangeType.ALTERA_ROTULOS,
                    evento: item as Evento,
                  })),
      map((evento: Evento) =>
              new fromActions.AlteraRotulosDoEventoSuccess({evento})));
}
