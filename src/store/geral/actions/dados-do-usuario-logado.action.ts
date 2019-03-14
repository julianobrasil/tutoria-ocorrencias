import {Action} from '@ngrx/store';

import {
  FuncaoDoUsuario,
  PermissaoDoUsuario,
} from '../../../app/model/helper-objects/funcoes-sistema';
import {ObjectReference} from '../../../app/ocorrencias/model';

export enum OBTEM_DADOS_USUARIO_LOGADO {
  RUN = '[GERAL:DADOS DO USUÁRIO LOGADO]: Obtém dados do usuário logado run',
  SUCCESS = '[GERAL:DADOS DO USUÁRIO LOGADO]: Obtém dados do usuário logado success',
  FAIL = '[GERAL:DADOS DO USUÁRIO LOGADO]: Obtém dados do usuário logado fail',
}

export class ObtemDadosDoUsuarioLogadoRun implements Action {
  readonly type = OBTEM_DADOS_USUARIO_LOGADO.RUN;
}

export class ObtemDadosDoUsuarioLogadoSuccess implements Action {
  readonly type = OBTEM_DADOS_USUARIO_LOGADO.SUCCESS;
  constructor(
    public payload: {
      usuarioRef: ObjectReference;
      funcoesDoUsuario: FuncaoDoUsuario[];
      permissoesDoUsuario: PermissaoDoUsuario[];
    },
  ) {}
}

export class ObtemDadosDoUsuarioLogadoFail implements Action {
  readonly type = OBTEM_DADOS_USUARIO_LOGADO.FAIL;
  constructor(public payload: {error: any}) {}
}

export type DadosDoUsuarioLogadoAction =
  | ObtemDadosDoUsuarioLogadoSuccess
  | ObtemDadosDoUsuarioLogadoRun
  | ObtemDadosDoUsuarioLogadoFail;
