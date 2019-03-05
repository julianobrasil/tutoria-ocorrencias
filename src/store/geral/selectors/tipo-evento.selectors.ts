import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/tipo-evento.reducer';

const getTipoEventoState = (state: fromFeature.GeralState) => state.TIPO_EVENTO;

export const getTipoEventos = createSelector(
  getTipoEventoState,
  fromReducers.getTipoEventos,
);
