// tslint:disable:max-line-length
import {AfterViewInit, Component, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs';

import {TipoEvento} from '../../../../../model/transport-objects/';
import {
  TipoSubtipoDeEventoComponentData,
} from '../../tipo-subtipo-de-evento/tipo-subtipo-de-evento.component';

import {
  TipoSubtipoDeEventoDialogComponentService,
} from './tipo-subtipo-de-evento-dialog-component.service';

// tslint:enable:max-line-length

export interface TipoSubtipoDeEventoDialogComponentData {
  dados: TipoSubtipoDeEventoComponentData;
}

@Component({
  selector: 'app-tipo-subtipo-de-evento-dialog',
  templateUrl: './tipo-subtipo-de-evento-dialog.component.html',
  styleUrls: ['./tipo-subtipo-de-evento-dialog.component.scss'],
})
export class TipoSubtipoDeEventoDialogComponent implements AfterViewInit {
  /** controle do formulário que manipula o dado */
  _formControl: FormControl = new FormControl();

  /** tipos de eventos disponíveis */
  _tipoEventos$: Observable<TipoEvento[]> =
      this._componentService.getTipoEventosDisponiveis$();

  /** valor original do componente TIPO:SUBTIPO */
  _valorOriginal: string;

  constructor(
      @Inject(MAT_DIALOG_DATA)
      private _data: TipoSubtipoDeEventoDialogComponentData,
      private _dialogRef: MatDialogRef<TipoSubtipoDeEventoDialogComponent,
                                       TipoSubtipoDeEventoComponentData>,
      private _componentService: TipoSubtipoDeEventoDialogComponentService) {
    this._valorOriginal = `${_data.dados.descricaoTipoEvento}:${
        _data.dados.descricaoSubTipoEvento}`;
  }

  ngAfterViewInit() {
    if (!this._data || !this._data.dados) {
      return;
    }

    setTimeout(() => this._formControl.setValue(this._data.dados));
  }

  /** fecha diálogo e emite valor escolhido */
  _gravaAlteracao() {
    if (this._formControl.invalid) {
      return;
    }

    const valor: TipoSubtipoDeEventoComponentData = this._formControl.value;
    if (valor.descricaoTipoEvento === this._data.dados.descricaoTipoEvento &&
        valor.descricaoSubTipoEvento ===
            this._data.dados.descricaoSubTipoEvento) {
      this._dialogRef.close(null);
    }

    this._dialogRef.close(valor);
  }

  /** desabilita o botão de gravar */
  get _botaoDeGravarDesabilitado() {
    if (!this._formControl.value) {
      return false;
    }
    const dadoCorrente = `${this._formControl.value.descricaoTipoEvento}:${
        this._formControl.value.descricaoSubTipoEvento}`;
    return dadoCorrente === this._valorOriginal;
  }
}
