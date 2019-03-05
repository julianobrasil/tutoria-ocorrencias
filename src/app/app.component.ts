import {Component} from '@angular/core';

import {Store} from '@ngrx/store';
import * as fromStore from '../store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ocorrencias';

  constructor(private _store: Store<{}>) {
    this._store.dispatch(new fromStore.GERAL.ACTIONS.ObtemTipoDeEventosDisponiveisRun());
  }
}
