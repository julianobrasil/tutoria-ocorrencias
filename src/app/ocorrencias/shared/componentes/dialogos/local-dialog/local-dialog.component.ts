import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface LocalDialogComponentData { local: string; }

@Component({
  selector: 'app-local-dialog',
  templateUrl: './local-dialog.component.html',
  styleUrls: ['./local-dialog.component.scss'],
})
export class LocalDialogComponent {
  /** controle do formulário que manipula o dado */
  _formControl: FormControl = new FormControl('');

  /** valor original do componente */
  _valorOriginal: string;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: LocalDialogComponentData,
              private _dialogRef: MatDialogRef<LocalDialogComponent,
                                               LocalDialogComponentData>) {
    this._valorOriginal = _data.local;

    this._formControl.setValue(_data.local);
  }

  _gravaAlteracao() {
    if (this._botaoDeGravarDesabilitado) {
      return;
    }

    this._dialogRef.close(this._formControl.value.replace(/\s\s+/g, ' '));
  }

  /** retorna true se o botão de gravar estiver desabilitado */
  get _botaoDeGravarDesabilitado(): boolean {
    return this._valorOriginal === this._formControl.value;
  }
}
