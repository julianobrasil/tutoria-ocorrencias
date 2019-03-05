import {Action} from '@ngrx/store';

import {Config, SemestreDeTrabalho} from '../../../app/model/transport-objects';

export enum OBTEM_CONFIG {
  RUN = '[GERAL:CONFIGURACOES GERAIS]: Obtém configuracoes gerais run',
  SUCCESS = '[GERAL:CONFIGURACOES GERAIS]: Obtém configuracoes gerais success',
}

export enum CONFIGURA_SEMESTRE_DE_TRABALHO {
  RUN = '[GERAL:CONFIGURACOES GERAIS]: Configura Semestre de Trabalho run',
  SUCCESS = '[GERAL:CONFIGURACOES GERAIS]: Obtém Semestre de Trabalho success',
}

export enum OBTEM_HORA_SERVIDOR {
  RUN = '[GERAL:CONFIGURACOES GERAIS]: Obtém hora do servidor run',
  SUCCESS = '[GERAL:CONFIGURACOES GERAIS]: Obtém hora do servidor success',
}

export class ObtemConfigRun implements Action {
  readonly type = OBTEM_CONFIG.RUN;
}

export class ObtemConfigSuccess implements Action {
  readonly type = OBTEM_CONFIG.SUCCESS;
  constructor(public payload: {config: Config}) {}
}

export class ConfiguraSemestreDeTrabalhoRun implements Action {
  readonly type = CONFIGURA_SEMESTRE_DE_TRABALHO.RUN;
}

export class ConfiguraSemestreDeTrabalhoSuccess implements Action {
  readonly type = CONFIGURA_SEMESTRE_DE_TRABALHO.SUCCESS;
  constructor(public payload: {semestreDeTrabalho: SemestreDeTrabalho}) {}
}

export class ObtemHoraDoServidorRun implements Action {
  readonly type = OBTEM_HORA_SERVIDOR.RUN;
}

export class ObtemHoraDoServidorSuccess implements Action {
  readonly type = OBTEM_HORA_SERVIDOR.SUCCESS;
  constructor(public payload: {diffHoraLocalServidorMilliSeconds: number}) {}
}

export type ConfiguracoesGeraisAction = ConfiguraSemestreDeTrabalhoRun|
    ConfiguraSemestreDeTrabalhoSuccess|ObtemConfigSuccess|ObtemConfigRun|
    ObtemHoraDoServidorRun|ObtemHoraDoServidorSuccess;
