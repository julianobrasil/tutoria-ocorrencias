import {SemestreDeTrabalho} from '../../../app/model/transport-objects';
import * as fromActions from '../actions';

export interface ConfiguracoesGeraisState {
  semestreDeTrabalho: SemestreDeTrabalho;
  diffHoraLocalServidorMilliSeconds: number;
}

export const initialState: ConfiguracoesGeraisState = {
  semestreDeTrabalho: null,
  diffHoraLocalServidorMilliSeconds: null,
};

export function configuracoesGeraisReducer(
    state: ConfiguracoesGeraisState = initialState,
    action: fromActions.ConfiguracoesGeraisAction,
    ): ConfiguracoesGeraisState {
  state = _obtemConfig(state, action);
  state = _configuraSemestreDeTrabalho(state, action);
  state = _configuraDiferencaDeHoraDoServidor(state, action);

  return state;
}

function _obtemConfig(
    state: ConfiguracoesGeraisState = initialState,
    action: fromActions.ConfiguracoesGeraisAction,
    ): ConfiguracoesGeraisState {
  switch (action.type) {
    case fromActions.OBTEM_CONFIG.SUCCESS: {
      return {
        ...state,
        semestreDeTrabalho: action.payload.config ?
            action.payload.config.semestreDeTrabalho :
            null,
      };
    }
  }

  return state;
}

function _configuraSemestreDeTrabalho(
    state: ConfiguracoesGeraisState = initialState,
    action: fromActions.ConfiguracoesGeraisAction,
    ): ConfiguracoesGeraisState {
  switch (action.type) {
    case fromActions.CONFIGURA_SEMESTRE_DE_TRABALHO.SUCCESS: {
      return {
        ...state,
        semestreDeTrabalho: action.payload.semestreDeTrabalho,
      };
    }
  }

  return state;
}

function _configuraDiferencaDeHoraDoServidor(
    state: ConfiguracoesGeraisState = initialState,
    action: fromActions.ConfiguracoesGeraisAction,
    ): ConfiguracoesGeraisState {
  switch (action.type) {
    case fromActions.OBTEM_HORA_SERVIDOR.SUCCESS: {
      return {
        ...state,
        diffHoraLocalServidorMilliSeconds:
            action.payload.diffHoraLocalServidorMilliSeconds,
      };
    }
  }

  return state;
}

export const getSemestreDeTrabalho = (state: ConfiguracoesGeraisState) =>
    state && state.semestreDeTrabalho ? state.semestreDeTrabalho : [];
export const getDiffHoraLocalServidorMilliSeconds =
    (state: ConfiguracoesGeraisState) =>
        state && state.diffHoraLocalServidorMilliSeconds !== null &&
        state.diffHoraLocalServidorMilliSeconds !== undefined ?
    state.diffHoraLocalServidorMilliSeconds :
    null;
