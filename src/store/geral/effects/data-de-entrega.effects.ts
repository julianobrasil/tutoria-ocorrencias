import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {
  DataDeEntregaRestService,
} from '../../../app/model/servicos/dao/data-de-entrega-rest.service';
import {DataDeEntrega} from '../../../app/model/transport-objects';
import * as fromActions from '../actions/data-de-entrega.action';

@Injectable({
  providedIn: 'root',
})
export class DataDeEntregaEffects {
  constructor(private _actions$: Actions,
              private _dataDeEntregaRestService: DataDeEntregaRestService) {}

  @Effect()
  obtemDataDeEntregas$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_DATAS_DE_ENTREGA_DISPONIVEIS.RUN),
      switchMap((action: fromActions.ObtemDatasDeEntregaDisponiveisRun) =>
                    this._dataDeEntregaRestService.findDatasDeEntrega(
                                                      action.payload.ano,
                                                      action.payload.semestre)
                        .pipe(catchError(() => observableOf([])))),
      map((datasDeEntrega: DataDeEntrega[]) =>
              new fromActions.ObtemDatasDeEntregaDisponiveisSuccess(
                  {datasDeEntrega})));
}
