import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {interval, of as observableOf, timer} from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mapTo,
  repeatWhen,
  switchMap,
} from 'rxjs/operators';

import {
  ConfiguracoesService,
} from '../../../app/model/servicos/dao/configuracoes.service';
import {Config} from '../../../app/model/transport-objects';
import * as fromActions from '../actions/configuracoes-gerais.action';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracoesGeraisEffects {
  constructor(private _actions$: Actions,
              private _configuracoesService: ConfiguracoesService) {}

  @Effect()
  obtemConfig$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_CONFIG.RUN),
      switchMap(() => this._configuracoesService.findUnique().pipe(
                    catchError(() => observableOf([])))),
      map((config: Config) =>
              new fromActions.ObtemConfigSuccess({config})));

  /*
   * Observe que o horário do servidor é renovado a cada 2 minutos. Isso visa
   * impedir que algum usuário tente burlar o horário localmente (na verdade,
   * por um período de 2 minutos, ele conseguirá burlar)
   */
  @Effect()
  obtemDiffHoraLocalServidorMilliSeconds$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_HORA_SERVIDOR.RUN),
      switchMap(
          () => timer(0, 120000).pipe(concatMap(
              () => this._configuracoesService.obtemDataEHoraServidor()))),
      map((horaNoServidor: Date) => {
        const diffHoraLocalServidorMilliSeconds: number =
            new Date().getTime() - horaNoServidor.getTime();
        return new fromActions.ObtemHoraDoServidorSuccess(
            {diffHoraLocalServidorMilliSeconds});
      }));
}
