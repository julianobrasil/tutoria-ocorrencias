import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as fromStore from '../../../../../../store';
import {TipoEvento} from '../../../../../model/transport-objects/';

@Injectable({providedIn: 'root'})
export class TipoSubtipoDeEventoDialogComponentService {
  constructor(private _store: Store<{}>) {}

  /** obtém os tipos de eventos disponíveis */
  getTipoEventosDisponiveis$(): Observable<TipoEvento[]> {
    return this._store.pipe(
        select(fromStore.GERAL.SELECTORS.TIPO_EVENTO.getTipoEventos));
  }
}
