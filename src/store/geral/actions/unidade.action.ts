import {Action} from '@ngrx/store';

import {Unidade} from '../../../app/model/transport-objects';

export enum OBTEM_UNIDADES_DISPONIVEIS {
  RUN = '[GERAL:UNIDADE]: Obtém unidades disponíveis run',
  SUCCESS = '[GERAL:UNIDADE]: Obtém unidades disponíveis success',
}

export class ObtemUnidadesDisponiveisRun implements Action {
  readonly type = OBTEM_UNIDADES_DISPONIVEIS.RUN;
}

export class ObtemUnidadesDisponiveisSuccess implements Action {
  readonly type = OBTEM_UNIDADES_DISPONIVEIS.SUCCESS;
  constructor(public payload: {unidades: Unidade[]}) {}
}

export type UnidadeAction =
    |ObtemUnidadesDisponiveisSuccess|ObtemUnidadesDisponiveisRun;