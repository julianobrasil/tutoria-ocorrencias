import {Action} from '@ngrx/store';

import {Tutoria} from '../../../app/model/transport-objects/';

export enum OBTEM_TUTORIAS_DO_USUARIO_LOGADO {
  RUN = '[GERAL:TIPO EVENTOS]: Obtém tutorias do usuário logado run',
  SUCCESS = '[GERAL:TIPO EVENTOS]: Obtém tutorias do usuário logado success',
}

export class ObtemTutoriasDoUsuarioLogadoRun implements Action {
  readonly type = OBTEM_TUTORIAS_DO_USUARIO_LOGADO.RUN;
}

export class ObtemTutoriasDoUsuarioLogadoSuccess implements Action {
  readonly type = OBTEM_TUTORIAS_DO_USUARIO_LOGADO.SUCCESS;
  constructor(public payload: {tutorias: Tutoria[]}) {}
}

export type TutoriaAction =
    ObtemTutoriasDoUsuarioLogadoRun|ObtemTutoriasDoUsuarioLogadoSuccess;