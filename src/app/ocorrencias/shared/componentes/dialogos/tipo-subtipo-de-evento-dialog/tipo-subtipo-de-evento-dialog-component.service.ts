import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {select, Store} from '@ngrx/store';

import * as fromStore from '../../../../../../store';

import {TipoEvento} from '@model-objects';

@Injectable({providedIn: 'root'})
export class TipoSubtipoDeEventoDialogComponentService {
  constructor(private _store: Store<{}>) {}

  /** obtém os tipos de eventos disponíveis */
  getTipoEventosDisponiveis$(): Observable<TipoEvento[]> {
    return this._store.pipe(select(fromStore.GERAL.SELECTORS.TIPO_EVENTO.getTipoEventos));
  }
}
