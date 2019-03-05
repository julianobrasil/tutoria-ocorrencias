import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/configuracoes-gerais.reducer';

const getConfiguracoesGeraisState = (state: fromFeature.GeralState) => state.CONFIGURACOES_GERAIS;

export const getSemestreDeTrabalho = createSelector(
  getConfiguracoesGeraisState,
  fromReducers.getSemestreDeTrabalho,
);

export const getDiffHoraLocalServidorMilliSeconds = createSelector(
  getConfiguracoesGeraisState,
  fromReducers.getDiffHoraLocalServidorMilliSeconds,
);
