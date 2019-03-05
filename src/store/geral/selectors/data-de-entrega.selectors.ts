import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/data-de-entrega.reducer';

const getDataDeEntregaState = (state: fromFeature.GeralState) => state.DATA_DE_ENTREGA;

export const getDatasDeEntrega = createSelector(
  getDataDeEntregaState,
  fromReducers.getDatasDeEntrega,
);
