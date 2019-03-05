import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import {AuthService} from '../../../app/auth/auth.service';
import {EventoRestService} from '../../../app/model/servicos/dao/evento-rest.service';
import {ImodbService} from '../../../app/model/servicos/imodb.service';
import {Evento, EventoPaginado, NovoEventoRequest, TipoEvento} from '../../../app/model/transport-objects/';
import {OcorrenciaOperacao, OcorrenciaStatusGravacaoService} from '../../../app/ocorrencias/ocorrencia-status-gravacao.service';
import * as fromActions from '../actions/evento.action';

@Injectable({
  providedIn: 'root',
})
export class EventoEffects {
  constructor(
      private _actions$: Actions,
      private _authService: AuthService,
      private _ocorrenciaStatusGravacaoService:
          OcorrenciaStatusGravacaoService,
      private _eventoService: EventoRestService,
      private _imodbService: ImodbService,
      private _route: ActivatedRoute,
      private _router: Router,
  ) {}

  @Effect()
  obtemEventos$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_EVENTOS_PAGINADOS.RUN),
      switchMap(
          (action: fromActions.ObtemEventosPaginadosRun) =>
              this._eventoService
                  .findEventosByUsuarioLogado(
                      action.payload.termoDeBusca,
                      action.payload.paginacao &&
                              action.payload.paginacao.page ?
                          action.payload.paginacao.page :
                          0,
                      action.payload.paginacao &&
                              action.payload.paginacao.pageSize ?
                          action.payload.paginacao.pageSize :
                          10,
                      )
                  .pipe(catchError(
                      () => observableOf({content: [], totalElements: 0}))),
          ),
      map(
          (pagina:
               EventoPaginado|{
                 content: any[];
                 totalElements: number
               }) => new fromActions.ObtemEventosPaginadosSuccess({
            eventos: pagina.content,
            totalElements: pagina.totalElements,
          }),
          ),
  );

  @Effect()
  obtemTiposEventos$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_TIPOS_EVENTOS.RUN),
      switchMap(
          () => observableOf(this._imodbService.tipos),
          ),
      map((tiposEventos: TipoEvento[]) =>
              new fromActions.ObtemTiposDeEventosSuccess({tiposEventos})),
  );

  @Effect()
  obtemEventoById$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_EVENTO_POR_ID.RUN),
      switchMap(
          (action: fromActions.ObtemEventoPorIdRun) =>
              this._eventoService.findEventoById(action.payload.id)
                  .pipe(catchError(e => observableOf(e))),
          ),
      map((evento: Evento|string) => typeof evento === 'string' ?
              new fromActions.ObtemEventoPorIdFail(
                  {error: '', eventoId: evento}) :
              new fromActions.ObtemEventoPorIdSuccess({evento})),
  );

  @Effect()
  alteraTipoEvento$ = this._actions$.pipe(
      ofType(fromActions.ALTERA_TIPO_EVENTO.RUN),
      switchMap(
          (action: fromActions.AlteraTipoDeEventoRun) =>
              this._eventoService.alteraTipoDeEvento(
                  action.payload.eventoId, action.payload.descricaoTipoEvento,
                  action.payload.descricaoSubTipoEvento),
          ),
      map((evento: Evento) =>
              new fromActions.AlteraTipoDeEventoSuccess({evento})),
  );

  @Effect({dispatch: false})
  excluiEvento$ = this._actions$.pipe(
      ofType(fromActions.EXCLUI_EVENTO.RUN),
      switchMap(
          (action: fromActions.ExcluiEventoRun) =>
              this._eventoService.removeEvento(action.payload.eventoId),
          ),
      tap(
          () => this._router.navigate(['../'], {relativeTo: this._route}),
          ));

  @Effect()
  reabreEvento$ = this._actions$.pipe(
      ofType(fromActions.REABRE_EVENTO.RUN),
      switchMap(
          (action: fromActions.ReabreEventoRun) =>
              this._eventoService.reabreEvento(
                  action.payload.eventoId,
                  action.payload.textoComentario?
                  action.payload.textoComentario: ''),
          ),
      tap((evento: Evento) =>
              this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaOperacao.REABRE_E_COMENTA
                  })),
      map((evento: Evento) => new fromActions.ReabreEventoSuccess({evento})),
  );

  @Effect()
  encerraEvento$ = this._actions$.pipe(
      ofType(fromActions.ENCERRA_EVENTO.RUN),
      switchMap(
          (action: fromActions.EncerraEventoRun) =>
              this._eventoService.encerraEvento(
                  action.payload.eventoId,
                  action.payload.textoComentario?
                  action.payload.textoComentario: ''),
          ),
      tap((evento: Evento) =>
              this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaOperacao.ENCERRA_E_COMENTA
                  })),
      map((evento: Evento) => new fromActions.EncerraEventoSuccess({evento})),
  );

  @Effect()
  insereComentario$ = this._actions$.pipe(
      ofType(fromActions.INSERE_COMENTARIO_EVENTO.RUN),
      switchMap(
          (action: fromActions.InsereComentarioRun) =>
              this._eventoService
                  .insereComentario(
                      action.payload.eventoId, action.payload.textoComentario)
                  .pipe(catchError((e: any) => {
                    this._ocorrenciaStatusGravacaoService
                        .statusGravacao$.next({
                          sucesso: false,
                          operacaoExecutada: OcorrenciaOperacao.COMENTA
                        });
                    return observableOf(null);
                  })),
          ),
      tap((evento: Evento|null) => evento ?
              this._ocorrenciaStatusGravacaoService.statusGravacao$
                  .next({
                    sucesso: true,
                    operacaoExecutada: OcorrenciaOperacao.COMENTA
                  }) :
              null),
      map((evento: Evento|null) => evento ?
              new fromActions.InsereComentarioSuccess({evento}) :
              new fromActions.InsereComentarioFail({error: null})),
  );

  @Effect()
  criaEvento$ = this._actions$.pipe(
      ofType(fromActions.CRIA_EVENTO.RUN),
      switchMap(
          (action: fromActions.CriaEventoRun) =>
              this._eventoService.criaEvento(action.payload.novoEventoRequest)
                  .pipe(catchError(
                      (error: NovoEventoRequest) => observableOf(error)))),
      tap((item: Evento|NovoEventoRequest) => {
              item.hasOwnProperty('tipoEventoId') ?
                  this._ocorrenciaStatusGravacaoService.statusGravacao$
                      .next({
                        sucesso: false,
                        operacaoExecutada: OcorrenciaOperacao.NOVO_EVENTO,
                      }) :
                  this._ocorrenciaStatusGravacaoService.statusGravacao$
                      .next({
                        sucesso: true,
                        operacaoExecutada: OcorrenciaOperacao.NOVO_EVENTO,
                        evento: item as Evento,
                      })}),
      map((item: Evento|NovoEventoRequest) =>
              item.hasOwnProperty('tipoEventoId') ?
              new fromActions.CriaEventoFail({error: item}) :
              new fromActions.CriaEventoSuccess({evento: item as Evento})));
}