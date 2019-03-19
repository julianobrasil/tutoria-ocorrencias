import {createSelector} from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromReducers from '../reducers/tipo-evento.reducer';

// tslint:disable-next-line: no-implicit-dependencies
import {SubTipoEvento, TipoEvento} from '@model-objects';

const getTipoEventoState = (state: fromFeature.GeralState) => state.TIPO_EVENTO;

export const getTipoEventos =
    createSelector(getTipoEventoState, fromReducers.getTipoEventos);

export const getTiposDeEventosByName =
    createSelector(getTipoEventos, (tipoEventos: TipoEvento[], params) => {
      params.partOfName = params.partOfName.toUpperCase();

      const array: TipoEvento[] = tipoEventos.filter(
          (ev: TipoEvento) =>
              ev.descricao.toUpperCase().includes(params.partOfName) ||
              ev.listaSubTipoEvento.some(
                  (s: SubTipoEvento) =>
                      s.descricao.toUpperCase().includes(params.partOfName)));

      return array.slice(params.page * params.pageSize,
                         params.page * params.pageSize + params.pageSize);
    });
