import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppRoutingModule} from './app-routing.module';
import {AuthModule} from './auth/auth.module';
import {AuthGuardModule} from './auth/guards/auth-guard.module';
import {CustomMaterialModule} from './custom-material.module';
import {ServicosSingletonModule} from './model/servicos/servicos-singleton.module';
import {ServicosModule} from './model/servicos/servicos.module';

import {AppComponent} from './app.component';

import {EVENTOS_EXISTENTES} from '../data/eventos';
import {Comentario, Evento} from './model/transport-objects';
import {Etapa} from './model/transport-objects/to';

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    this._fixEventos();
  }

  _fixEventos(): void {
    EVENTOS_EXISTENTES.forEach((evt: Evento) => {
      if (evt.tutoria.historicoTutores.length) {
        evt.tutoria.historicoTutores.sort(
          (a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime(),
        );
      }

      const tutor = evt.tutoria.historicoTutores[0];

      const titulo =
        evt.parecer
          .split(' ')
          .splice(0, 20)
          .filter((item) => !!item)
          .join(' ') + '...';

      evt.comentarios = evt.etapas.map(
        (etapa: Etapa): Comentario => ({
          autorRef: {
            code: etapa.emailResponsavel,
            description: etapa.emailResponsavel,
          },
          dataCriacao: etapa.dataFim,
          historicoComentario: [
            {
              data: etapa.dataFim,
              texto: etapa.parecer,
            },
          ],
          id: '' + new Date().getTime() + Math.random(),
        }),
      );

      evt.titulo = titulo;

      evt.autorEvento = tutor
        ? {
            code: tutor.email,
            description: tutor.nomeTutor,
          }
        : null;
    });
  }
}
