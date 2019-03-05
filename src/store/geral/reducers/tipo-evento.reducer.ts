import {TipoEvento} from '../../../app/model/transport-objects/';
import * as fromActions from '../actions';

export interface TipoEventoState {
  tipoEventos: TipoEvento[];
}

export const initialState: TipoEventoState = {
  tipoEventos: [],
};

export function tipoEventoReducer(
    state: TipoEventoState = initialState,
    action: fromActions.TipoEventoAction,
    ): TipoEventoState {
  state = _listaTipoEventos(state, action);

  return state;
}

function _listaTipoEventos(
    state: TipoEventoState = initialState,
    action: fromActions.TipoEventoAction,
    ): TipoEventoState {
  switch (action.type) {
    case fromActions.OBTEM_TIPO_EVENTOS_DISPONIVEIS.SUCCESS: {
      return {
        ...state,
        tipoEventos: action.payload.tipoEventos,
      };
    }
  }

  return state;
}

export const getTipoEventos = (state: TipoEventoState) =>
    state && state.tipoEventos ? state.tipoEventos : [];
