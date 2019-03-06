import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {of as observableOf} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

import {AuthService} from '../../../app/auth/auth.service';
import {TutoriaService} from '../../../app/model/servicos/dao/tutoria.service';

import {Tutoria} from '../../../app/model/transport-objects';
import * as fromActions from '../actions/tutoria.action';

@Injectable({
  providedIn: 'root',
})
export class TutoriaEffects {
  constructor(private _actions$: Actions, private _authService: AuthService,
              private _tutoriaService: TutoriaService) {}

  @Effect()
  obtemTutorias$ = this._actions$.pipe(
      ofType(fromActions.OBTEM_TUTORIAS_DO_USUARIO_LOGADO.RUN),
      switchMap(() => this._tutoriaService.findTutoriaByEmailTutorAtivo(
                                              this._authService.email)
                          .pipe(catchError(() => observableOf([])))),
      map((tutorias: Tutoria[]) =>
              new fromActions.ObtemTutoriasDoUsuarioLogadoSuccess({tutorias})));
}
