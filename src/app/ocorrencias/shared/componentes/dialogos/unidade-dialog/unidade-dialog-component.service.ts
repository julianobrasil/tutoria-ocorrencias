import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import * as fromStore from '../../../../../../store';
import {Unidade} from '../../../../../model/transport-objects/';

@Injectable({
  providedIn: 'root',
})
export class UnidadeDialogComponentService {
  constructor(private _store$: Store<{}>) {}

  getUnidades$(): Observable<string[]> {
    return this._store$.pipe(
        select(fromStore.GERAL.SELECTORS.UNIDADE.getUnidades),
        map((us: Unidade[]) =>
                us.map((u: Unidade) => `${u.cidade}:${u.unidade}`)));
  }
}
