import {Unidade} from '../../../app/model/transport-objects';
import * as fromActions from '../actions';

export interface UnidadeState {
  unidades: Unidade[];
}

export const initialState: UnidadeState = {
  unidades: [],
};

export function unidadeReducer(
    state: UnidadeState = initialState,
    action: fromActions.UnidadeAction,
    ): UnidadeState {
  state = _listaUnidades(state, action);

  return state;
}

function _listaUnidades(
    state: UnidadeState = initialState,
    action: fromActions.UnidadeAction,
    ): UnidadeState {
  switch (action.type) {
    case fromActions.OBTEM_UNIDADES_DISPONIVEIS.SUCCESS: {
      return {
        ...state,
        unidades: action.payload.unidades,
      };
    }
  }

  return state;
}

export const getUnidades = (state: UnidadeState) =>
    state && state.unidades ? state.unidades : [];
