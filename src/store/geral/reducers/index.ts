import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';

import * as fromConfiguracoesGeraisReducers from './configuracoes-gerais.reducer';
import * as fromDataDeEntregaReducers from './data-de-entrega.reducer';
import * as fromTipoEventoReducers from './tipo-evento.reducer';
import * as fromTutoriaReducers from './tutoria.reducer';
import * as fromUnidadeReducers from './unidade.reducer';

export interface GeralState {
  CONFIGURACOES_GERAIS:
      fromConfiguracoesGeraisReducers.ConfiguracoesGeraisState;
  DATA_DE_ENTREGA: fromDataDeEntregaReducers.DataDeEntregaState;
  TIPO_EVENTO: fromTipoEventoReducers.TipoEventoState;
  TUTORIA: fromTutoriaReducers.TutoriaState;
  UNIDADE: fromUnidadeReducers.UnidadeState;
}

export const geralReducers: ActionReducerMap<GeralState> = {
  CONFIGURACOES_GERAIS:
      fromConfiguracoesGeraisReducers.configuracoesGeraisReducer,
  DATA_DE_ENTREGA: fromDataDeEntregaReducers.dataDeEntregaReducer,
  TIPO_EVENTO: fromTipoEventoReducers.tipoEventoReducer,
  TUTORIA: fromTutoriaReducers.tutoriaReducer,
  UNIDADE: fromUnidadeReducers.unidadeReducer,
};
