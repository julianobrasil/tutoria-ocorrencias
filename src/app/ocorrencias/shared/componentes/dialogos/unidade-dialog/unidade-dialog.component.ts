import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatOptionSelectionChange,
} from '@angular/material';
import {Observable} from 'rxjs';

import {
  UnidadeDialogComponentService,
} from './unidade-dialog-component.service';

export interface UnidadeDialogComponentData {
  /** unidade no formato CIDADE:UNIDADE */
  unidade: string;
}

@Component({
  selector: 'app-unidade-dialog',
  templateUrl: './unidade-dialog.component.html',
  styleUrls: ['./unidade-dialog.component.scss'],
})
export class UnidadeDialogComponent {
  /** controle do formulário que manipula o dado */
  _formControl: FormControl = new FormControl('');

  /** valor original do componente */
  _valorOriginal: string;

  /** unidades disponíveis */
  _unidades$: Observable<string[]> = this._componentService.getUnidades$();

  constructor(
      @Inject(MAT_DIALOG_DATA) private _data: UnidadeDialogComponentData,
      private _componentService: UnidadeDialogComponentService,
      private _dialogRef:
          MatDialogRef<UnidadeDialogComponent, UnidadeDialogComponentData>) {
    this._valorOriginal = this._data.unidade;

    this._formControl.setValue(this._data.unidade);
  }

  /** grava a troca de unidade */
  _gravaAlteracao() {
    if (this._botaoDeGravarDesabilitado) {
      return;
    }

    this._dialogRef.close(this._formControl.value);
  }

  /** limpa o controle de unidade quando o usuário seleciona "NENHUMA" */
  _trataOpcaoNenhuma(selection: MatOptionSelectionChange) {
    if (!selection.source.value) {
      this._formControl.setValue(null);
    }
  }

  /** retorna true se o botão de gravar estiver desabilitado */
  get _botaoDeGravarDesabilitado(): boolean {
    return this._valorOriginal === this._formControl.value;
  }
}
