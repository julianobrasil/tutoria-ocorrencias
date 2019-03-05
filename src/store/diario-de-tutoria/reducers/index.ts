import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromReducers from './eventos.reducer';

export interface DiarioDeTutoriaState {
  eventos: fromReducers.EventoState;
}

export const reducers: ActionReducerMap<DiarioDeTutoriaState> = {
  eventos: fromReducers.reducer,
};

export const getDiarioDeTutoriaState = createFeatureSelector<DiarioDeTutoriaState>(
  'DIARIO_DE_TUTORIA',
);
