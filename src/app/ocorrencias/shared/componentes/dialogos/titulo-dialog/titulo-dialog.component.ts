import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface TituloDialogComponentData {
  titulo: string;
}

@Component({
  selector: 'app-titulo-dialog',
  templateUrl: './titulo-dialog.component.html',
  styleUrls: ['./titulo-dialog.component.scss'],
})
export class TituloDialogComponent {
  /** controle do formulário que manipula o dado */
  _formControl: FormControl = new FormControl('', Validators.required);

  /** valor original do componente */
  _valorOriginal: string;

  constructor(
      @Inject(MAT_DIALOG_DATA) private _data: TituloDialogComponentData,
      private _dialogRef:
          MatDialogRef<TituloDialogComponent, TituloDialogComponentData>,
  ) {
    this._valorOriginal = _data.titulo;

    this._formControl.setValue(_data.titulo);
  }

  _gravaAlteracao() {
    if (this._botaoDeGravarDesabilitado) {
      return;
    }

    this._dialogRef.close(this._formControl.value.replace(/\s\s+/g, ' '));
  }

  /** retorna true se o botão de gravar estiver desabilitado */
  get _botaoDeGravarDesabilitado(): boolean {
    return this._formControl.invalid ||
        this._valorOriginal === this._formControl.value;
  }
}
