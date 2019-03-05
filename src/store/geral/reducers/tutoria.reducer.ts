import {Tutoria} from '../../../app/model/transport-objects';
import * as fromActions from '../actions';

export interface TutoriaState {
  tutorias: Tutoria[];
}

export const initialState: TutoriaState = {
  tutorias: [],
};

export function tutoriaReducer(
    state: TutoriaState = initialState,
    action: fromActions.TutoriaAction,
    ): TutoriaState {
  state = _listaTutorias(state, action);

  return state;
}

function _listaTutorias(
    state: TutoriaState = initialState,
    action: fromActions.TutoriaAction,
    ): TutoriaState {
  switch (action.type) {
    case fromActions.OBTEM_TUTORIAS_DO_USUARIO_LOGADO.SUCCESS: {
      return {
        ...state,
        tutorias: action.payload.tutorias,
      };
    }
  }

  return state;
}

export const getTutorias = (state: TutoriaState) =>
    state && state.tutorias ? state.tutorias : [];
