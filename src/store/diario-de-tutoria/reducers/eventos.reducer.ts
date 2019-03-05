import {Evento} from '../../../app/model/transport-objects';
import {TipoEvento, Tutoria} from '../../../app/model/transport-objects/';
import {Paginacao} from '../../../app/ocorrencias/ocorrencia-facade.service';
import * as fromActions from '../actions';

export interface EventoState {
  eventos: Evento[];
  paginacao: Paginacao;
  termoDeBusca: string;
  eventoPorIdErro: boolean;
}

export const initialState: EventoState = {
  eventos: [],
  paginacao: null,
  termoDeBusca: '',
  eventoPorIdErro: false,
};

export function reducer(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  state = _configraDadosDePaginacao(state, action);
  state = _listaEventos(state, action);
  state = _obtemEventoPorId(state, action);
  state = _alteraTipoEvento(state, action);
  state = _reabreEncerraEvento(state, action);
  state = _insereComentario(state, action);
  state = _criaEvento(state, action);

  return state;
}

function _configraDadosDePaginacao(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.CONFIGURA_DADOS_PAGINACAO.RUN: {
      return {
        ...state,
        paginacao: action.payload.paginacao,
      };
    }
  }

  return state;
}

function _listaEventos(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.OBTEM_EVENTOS_PAGINADOS.RUN: {
      return {
        ...state,
        eventoPorIdErro: false,
        termoDeBusca: action.payload.termoDeBusca,
        paginacao: action.payload.paginacao ? action.payload.paginacao : {
          page: 0,
          pageSize: 10,
        },
      };
    }

    case fromActions.EVENTO.OBTEM_EVENTOS_PAGINADOS.SUCCESS: {
      return {
        ...state,
        eventos: action.payload.eventos,
        paginacao: {
          ...state.paginacao,
          totalElements: action.payload.totalElements,
        },
      };
    }
  }

  return state;
}

function _obtemEventoPorId(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.OBTEM_EVENTO_POR_ID.RUN: {
      return {
        ...state, eventoPorIdErro: false,
      }
    }
    case fromActions.EVENTO.OBTEM_EVENTO_POR_ID.SUCCESS: {
      const index: number|null = action.payload.evento ?
          state.eventos.findIndex(
              (evt: Evento) => evt.id === action.payload.evento.id) :
          null;

      if (index !== null) {
        const eventos = [...state.eventos];
        if (index > -1) {
          eventos.splice(index, 1, action.payload.evento);

          return {
            ...state,
            eventos,
          };
        } else {
          eventos.push(action.payload.evento);

          return {
            ...state,
            eventos,
          };
        }
      }
      break;
    }

    case fromActions.EVENTO.OBTEM_EVENTO_POR_ID.FAIL: {
      const index: number|null = action.payload.eventoId ?
          state.eventos.findIndex(
              (evt: Evento) => evt.id === action.payload.eventoId) :
          null;
      const eventos = [...state.eventos];


      if (index !== null && index > -1) {
        eventos.splice(index, 1);
      }

      return {
        ...state, eventos, eventoPorIdErro: true,
      }
    }
  }

  return state;
}

function _alteraTipoEvento(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.ALTERA_TIPO_EVENTO.SUCCESS: {
      const index: number|null = action.payload.evento ?
          state.eventos.findIndex(
              (evt: Evento) => evt.id === action.payload.evento.id) :
          null;

      if (index !== null) {
        const eventos = [...state.eventos];
        if (index > -1) {
          eventos.splice(index, 1, action.payload.evento);

          return {
            ...state,
            eventos,
          };
        } else {
          eventos.push(action.payload.evento);

          return {
            ...state,
            eventos,
          };
        }
      }
    }
  }

  return state;
}

function _reabreEncerraEvento(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.ENCERRA_EVENTO.RUN:
    case fromActions.EVENTO.REABRE_EVENTO.RUN: {
      return {
        ...state,
      };
    }

    case fromActions.EVENTO.ENCERRA_EVENTO.SUCCESS:
    case fromActions.EVENTO.REABRE_EVENTO.SUCCESS: {
      const index: number|null = action.payload.evento ?
          state.eventos.findIndex(
              (evt: Evento) => evt.id === action.payload.evento.id) :
          null;

      if (index !== null) {
        const eventos = [...state.eventos];
        if (index > -1) {
          eventos.splice(index, 1, action.payload.evento);

          return {
            ...state,
            eventos,
          };
        } else {
          eventos.push(action.payload.evento);

          return {
            ...state,
            eventos,
          };
        }
      }
    }
  }

  return state;
}

function _insereComentario(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.INSERE_COMENTARIO_EVENTO.SUCCESS: {
      const index: number|null = action.payload.evento ?
          state.eventos.findIndex(
              (evt: Evento) => evt.id === action.payload.evento.id) :
          null;

      if (index !== null) {
        const eventos = [...state.eventos];
        if (index > -1) {
          eventos.splice(index, 1, action.payload.evento);

          return {
            ...state,
            eventos,
          };
        } else {
          eventos.push(action.payload.evento);

          return {
            ...state,
            eventos,
          };
        }
      }
    }
  }

  return state;
}

function _criaEvento(
    state: EventoState = initialState,
    action: fromActions.EVENTO.EventoAction,
    ): EventoState {
  switch (action.type) {
    case fromActions.EVENTO.CRIA_EVENTO.SUCCESS: {
      const eventos: Evento[] = [...state.eventos, action.payload.evento];

      return {
        ...state,
        eventos,
      }
    }
  }

  return state;
}

export const getEvetoByIdErro = (state: EventoState) =>
    state ? state.eventoPorIdErro : true;
export const getEventos = (state: EventoState) =>
    (state && state.eventos ? state.eventos : []);
export const getPaginacao = (state: EventoState) =>
    (state ? state.paginacao : null);
export const getTermoDeBusca = (state: EventoState) =>
    (state ? state.termoDeBusca : '');