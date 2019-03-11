import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {
  DadosDoUsuarioLogado,
  DadosDoUsuarioLogadoService,
} from '../../../app/model/servicos/dados-do-usuario-logado.service';

import * as fromActions from '../actions/dados-do-usuario-logado.action';

@Injectable({
  providedIn: 'root',
})
export class DadosDoUsuarioLogadoEffects {
  constructor(
    private _actions$: Actions,
    private _dadosDoUsuarioLogadoService: DadosDoUsuarioLogadoService,
  ) {}

  @Effect()
  obtemDadosDoUsuarioLogado$ = this._actions$.pipe(
    ofType(fromActions.OBTEM_DADOS_USUARIO_LOGADO.RUN),
    switchMap(() =>
      this._dadosDoUsuarioLogadoService
        .obtemDadosDoUsuarioLogado()
        .pipe(catchError((e) => observableOf(e))),
    ),
    map((dadosDoUsuarioLogado: DadosDoUsuarioLogado | string) =>
      typeof dadosDoUsuarioLogado !== 'string'
        ? new fromActions.ObtemDadosDoUsuarioLogadoSuccess({...dadosDoUsuarioLogado})
        : new fromActions.ObtemDadosDoUsuarioLogadoFail({error: dadosDoUsuarioLogado}),
    ),
  );
}
