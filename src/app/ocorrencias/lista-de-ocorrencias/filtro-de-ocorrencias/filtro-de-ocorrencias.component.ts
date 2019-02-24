import {Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-filtro-de-ocorrencias',
  templateUrl: './filtro-de-ocorrencias.component.html',
  styleUrls: ['./filtro-de-ocorrencias.component.scss'],
})
export class FiltroDeOcorrenciasComponent implements OnDestroy {
  /** emite o termo digitado */
  @Output()
  termoDeBusca: EventEmitter<string | null | undefined> = new EventEmitter<
    string | null | undefined
  >();

  /** input na template */
  _inputCtrl: FormControl = new FormControl();

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this._inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this._destroy$),
      )
      .subscribe((v: string | null | undefined) => this.termoDeBusca.emit(v));
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }
}
