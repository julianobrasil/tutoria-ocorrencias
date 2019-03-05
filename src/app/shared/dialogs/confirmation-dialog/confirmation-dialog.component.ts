import {Component, Inject, OnInit, Optional} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

export interface ConfirmationDialogComponentData {
  titulo?: string;
  mensagem?: string;
  botaoTrueText?: string;
  botaoTrueVisible?: boolean;
  botaoFalseText?: string;
  botaoFalseVisible?: boolean;
  botaoTrueDisabled?: boolean;
  botaoFalseDisabled?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent implements OnInit {
  titulo: string;
  mensagem: string;
  botaoTrueText = 'Fechar';
  botaoTrueVisible = true;
  botaoFalseText = 'Não';
  botaoFalseVisible = false;
  botaoTrueDisabled = false;
  botaoFalseDisabled = false;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) private _data: ConfirmationDialogComponentData,
    public _dialogRef: MatDialogRef<ConfirmationDialogComponent>,
  ) {
    if (_data) {
      this.titulo = _data.titulo;
      this.mensagem = _data.mensagem;
      this.botaoTrueText = _data.botaoTrueText;
      this.botaoTrueVisible = _data.botaoTrueVisible;
      this.botaoFalseText = _data.botaoFalseText;
      this.botaoFalseVisible = _data.botaoFalseVisible;
      this.botaoTrueDisabled = _data.botaoTrueDisabled;
      this.botaoFalseDisabled = _data.botaoFalseDisabled;
    }
  }

  ngOnInit() {}
}
