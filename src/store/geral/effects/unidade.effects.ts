import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {UnidadeRestService} from '../../../app/model/servicos/dao/unidade-rest.service';
import {Unidade} from '../../../app/model/transport-objects';
import * as fromActions from '../actions/unidade.action';

@Injectable({
  providedIn: 'root',
})
export class UnidadeEffects {
  constructor(
      private _actions$: Actions, private _unidadeService: UnidadeRestService) {
  }

  @Effect()
  obtemUnidadesDisponveis$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_UNIDADES_DISPONIVEIS.RUN),
      switchMap(
          () => this._unidadeService.findUnidades().pipe(
              catchError(() => observableOf([]))),
          ),
      map(
          (unidades: Unidade[]) =>
              new fromActions.ObtemUnidadesDisponiveisSuccess({unidades}),
          ),
  );
}
