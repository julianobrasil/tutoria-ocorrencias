import {Action} from '@ngrx/store';

import {TipoEvento} from '../../../app/model/transport-objects/';

export enum OBTEM_TIPO_EVENTOS_DISPONIVEIS {
  RUN = '[GERAL:TIPO EVENTOS]: Obtém tipos eventos run',
  SUCCESS = '[GERAL:TIPO EVENTOS]: Obtém tipos eventos success',
}

export class ObtemTipoDeEventosDisponiveisRun implements Action {
  readonly type = OBTEM_TIPO_EVENTOS_DISPONIVEIS.RUN;
}

export class ObtemTipoDeEventosDisponiveisSuccess implements Action {
  readonly type = OBTEM_TIPO_EVENTOS_DISPONIVEIS.SUCCESS;
  constructor(public payload: {tipoEventos: TipoEvento[]}) {}
}

export type TipoEventoAction =
    |ObtemTipoDeEventosDisponiveisSuccess|ObtemTipoDeEventosDisponiveisRun;
