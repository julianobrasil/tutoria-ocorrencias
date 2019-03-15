import * as fromActions from '../actions';

import {
  FuncaoDoUsuario,
  PermissaoDoUsuario,
} from '../../../app/model/helper-objects/funcoes-sistema';
import {ObjectReference} from '../../../app/model/transport-objects';

export interface DadosDoUsuarioLogadoState {
  usuarioRef: ObjectReference;
  permissoesDoUsuario: PermissaoDoUsuario[];
  funcoesDoUsuario: FuncaoDoUsuario[];
}

export const initialState: DadosDoUsuarioLogadoState = {
  usuarioRef: null,
  permissoesDoUsuario: [],
  funcoesDoUsuario: [],
};

export function dadosDoUsuarioLogadoReducer(
  state: DadosDoUsuarioLogadoState = initialState,
  action: fromActions.DadosDoUsuarioLogadoAction,
): DadosDoUsuarioLogadoState {
  state = _obtemDadosDoUsuarioLogado(state, action);

  return state;
}

function _obtemDadosDoUsuarioLogado(
  state: DadosDoUsuarioLogadoState = initialState,
  action: fromActions.DadosDoUsuarioLogadoAction,
): DadosDoUsuarioLogadoState {
  switch (action.type) {
    case fromActions.OBTEM_DADOS_USUARIO_LOGADO.SUCCESS: {
      return {
        ...state,
        usuarioRef: action.payload.usuarioRef,
        funcoesDoUsuario: action.payload.funcoesDoUsuario,
        permissoesDoUsuario: action.payload.permissoesDoUsuario,
      };
    }

    case fromActions.OBTEM_DADOS_USUARIO_LOGADO.FAIL: {
    }
  }

  return state;
}

export const getUsuarioRef = (state: DadosDoUsuarioLogadoState) =>
  state && state.usuarioRef ? state.usuarioRef : null;
export const getFuncoesDoUsuario = (state: DadosDoUsuarioLogadoState) =>
  state && state.funcoesDoUsuario ? state.funcoesDoUsuario : [];
export const getPermissoesDoUsuario = (state: DadosDoUsuarioLogadoState) =>
  state && state.permissoesDoUsuario ? state.permissoesDoUsuario : [];
