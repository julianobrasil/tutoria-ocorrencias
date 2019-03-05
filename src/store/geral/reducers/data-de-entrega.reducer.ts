import {DataDeEntrega} from '../../../app/model/transport-objects';
import * as fromActions from '../actions';

export interface DataDeEntregaState {
  datasDeEntrega: DataDeEntrega[];
}

export const initialState: DataDeEntregaState = {
  datasDeEntrega: [],
};

export function dataDeEntregaReducer(
    state: DataDeEntregaState = initialState,
    action: fromActions.DataDeEntregaAction,
    ): DataDeEntregaState {
  state = _listaDataDeEntregas(state, action);

  return state;
}

function _listaDataDeEntregas(
    state: DataDeEntregaState = initialState,
    action: fromActions.DataDeEntregaAction,
    ): DataDeEntregaState {
  switch (action.type) {
    case fromActions.OBTEM_DATAS_DE_ENTREGA_DISPONIVEIS.SUCCESS: {
      return {
        ...state,
        datasDeEntrega: action.payload.datasDeEntrega,
      };
    }
  }

  return state;
}

export const getDatasDeEntrega = (state: DataDeEntregaState) =>
    state && state.datasDeEntrega ?
    state.datasDeEntrega.map(
        (d: DataDeEntrega) => d.datas =
            d.datas.map((date: Date|string) => new Date(date))) :
    [];
