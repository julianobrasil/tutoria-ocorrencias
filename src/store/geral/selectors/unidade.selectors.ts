import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/unidade.reducer';

const getUnidadeState = (state: fromFeature.GeralState) => state.UNIDADE;

export const getUnidades = createSelector(
  getUnidadeState,
  fromReducers.getUnidades,
);
