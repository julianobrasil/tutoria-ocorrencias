import {createSelector} from '@ngrx/store';

import {Evento} from '../../../app/model/transport-objects';
import * as fromFeature from '../reducers';
import * as fromEventoReducers from '../reducers/eventos.reducer';

export const getEventosState = createSelector(
    fromFeature.getDiarioDeTutoriaState,
    (state: fromFeature.DiarioDeTutoriaState) => state.eventos,
);

export const getEventoByIdErro = createSelector(
    getEventosState,
    fromEventoReducers.getEvetoByIdErro,
);

export const getEventos = createSelector(
    getEventosState,
    fromEventoReducers.getEventos,
);

export const getPaginacao = createSelector(
    getEventosState,
    fromEventoReducers.getPaginacao,
);

export const getTermoDeBusca = createSelector(
    getEventosState,
    fromEventoReducers.getTermoDeBusca,
);

export const getEventoById = createSelector(
    getEventos,
    (eventos: Evento[], params) =>
        eventos.find((ev: Evento) => ev.id === params.id),
);
