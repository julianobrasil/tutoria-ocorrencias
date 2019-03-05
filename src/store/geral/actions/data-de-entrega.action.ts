import {Action} from '@ngrx/store';

import {DataDeEntrega} from '../../../app/model/transport-objects';

export enum OBTEM_DATAS_DE_ENTREGA_DISPONIVEIS {
  RUN = '[GERAL:DATAS DE ENTREGA]: Obtém datas de entrega disponíveis run',
  SUCCESS =
      '[GERAL:DATAS DE ENTREGA]: Obtém datas de entrega disponíveis success',
}

export class ObtemDatasDeEntregaDisponiveisRun implements Action {
  readonly type = OBTEM_DATAS_DE_ENTREGA_DISPONIVEIS.RUN;
  constructor(public payload: {ano: number; semestre: number;}) {}
}

export class ObtemDatasDeEntregaDisponiveisSuccess implements Action {
  readonly type = OBTEM_DATAS_DE_ENTREGA_DISPONIVEIS.SUCCESS;
  constructor(public payload: {datasDeEntrega: DataDeEntrega[]}) {}
}

export type DataDeEntregaAction =
    |ObtemDatasDeEntregaDisponiveisSuccess|ObtemDatasDeEntregaDisponiveisRun;