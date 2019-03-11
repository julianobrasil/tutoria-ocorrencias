import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/dados-do-usuario-logado.reducer';

const getDadosDoUsuarioLogadoState = (state: fromFeature.GeralState) =>
    state.DADOS_DO_USUARIO_LOGADO;

export const getUsuarioRef = createSelector(
    getDadosDoUsuarioLogadoState,
    fromReducers.getUsuarioRef,
);

export const getFuncoesDoUsuario = createSelector(
    getDadosDoUsuarioLogadoState,
    fromReducers.getFuncoesDoUsuario,
);

export const getPermissoesDoUsuario = createSelector(
    getDadosDoUsuarioLogadoState,
    fromReducers.getPermissoesDoUsuario,
);
