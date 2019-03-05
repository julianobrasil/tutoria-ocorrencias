import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/tutoria.reducer';

const getTutoriaState = (state: fromFeature.GeralState) => state.TUTORIA;

export const getTutorias = createSelector(
  getTutoriaState,
  fromReducers.getTutorias,
);
