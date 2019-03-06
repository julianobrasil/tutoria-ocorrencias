import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Evento} from '../../../model/transport-objects';
import {
  TituloDialogComponent,
  TituloDialogComponentData,
} from '../../shared/componentes/dialogos/titulo-dialog/titulo-dialog.component';
import {
  OcorrenciaDetalhesOperation,
} from '../ocorrencia-detalhes-component.service';

export interface OcorrenciaDetalhesTituloChanged {
  type: OcorrenciaDetalhesOperation;
  valor: string;
}

@Component({
  selector: 'app-ocorrencia-detalhes-titulo',
  templateUrl: './ocorrencia-detalhes-titulo.component.html',
  styleUrls: ['./ocorrencia-detalhes-titulo.component.scss'],
})
export class OcorrenciaDetalhesTituloComponent {
  /** texto do título */
  @Input() ocorrencia: Evento;

  /** emite quando o título é alterado */
  @Output()
  ocorrenciaChanged: EventEmitter<OcorrenciaDetalhesTituloChanged> =
      new EventEmitter<OcorrenciaDetalhesTituloChanged>();

  /** apresenta botão de alterar local */
  _mostraBotaoAlterarLocal = false;

  constructor(private _dialog: MatDialog) {}

  /** abre diálogo de alteração do título */
  _abreDialogoAlteracaoDeTitulo() {
    const data: TituloDialogComponentData = {
      titulo: this.ocorrencia.titulo,
    };

    const dialogRef =
        this._dialog
            .open<TituloDialogComponent, TituloDialogComponentData, string>(
                TituloDialogComponent, {data, width: '600px'});

    dialogRef.afterClosed().subscribe(
        (titulo: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaDetalhesOperation.ALTERA_TITULO,
          valor: titulo,
        }));
  }

  /** obtém o ícone a ser mostrado (de ocorrência aberta/fechada) */
  get _iconClass(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-titulo-subtitulo-icon': true,
      'icon-ocorrencia-nao-finalizada':
          this.ocorrencia ? !this.ocorrencia.isResolvido : false,
      'icon-ocorrencia-finalizada':
          this.ocorrencia ? this.ocorrencia.isResolvido : false,
    };
  }
}
