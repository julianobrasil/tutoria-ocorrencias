import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {
  TipoEventoService,
} from '../../../app/model/servicos/dao/tipo-evento.service';
import {TipoEvento} from '../../../app/model/transport-objects/';
import * as fromActions from '../actions/tipo-evento.action';

@Injectable({
  providedIn: 'root',
})
export class TipoEventoEffects {
  constructor(private _actions$: Actions,
              private _tipoEventoService: TipoEventoService) {}

  @Effect()
  obtemTipoEventos$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_TIPO_EVENTOS_DISPONIVEIS.RUN),
      switchMap(() => this._tipoEventoService.findAllTipoEventos().pipe(
                    catchError(() => observableOf([])))),
      map((tipoEventos: TipoEvento[]) =>
              new fromActions.ObtemTipoDeEventosDisponiveisSuccess(
                  {tipoEventos})));
}
