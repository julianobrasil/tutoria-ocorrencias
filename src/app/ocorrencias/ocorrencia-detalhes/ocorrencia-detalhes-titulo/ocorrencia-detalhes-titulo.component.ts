// tslint:disable: max-line-length
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Evento} from '@model-objects';
import {
  OcorrenciaFormularioComponentTipo,
} from '../../ocorrencia-formulario/ocorrencia-formulario-component.service';
import {
  TituloDialogComponent,
  TituloDialogComponentData,
} from '../../shared/componentes/dialogos/titulo-dialog/titulo-dialog.component';

import {OcorrenciaChange, OcorrenciaChangeType} from '../../public_api';
// tslint:enable: max-line-length

@Component({
  selector: 'app-ocorrencia-detalhes-titulo',
  templateUrl: './ocorrencia-detalhes-titulo.component.html',
  styleUrls: ['./ocorrencia-detalhes-titulo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaDetalhesTituloComponent {
  /** texto do título */
  @Input() ocorrencia: Evento;

  /** emite quando o título é alterado */
  @Output()
  ocorrenciaChanged: EventEmitter<OcorrenciaChange> =
      new EventEmitter<OcorrenciaChange>();

  /** emite quando o usuário clica no botão de nova ocorrência */
  @Output()
  novaOcorrencia: EventEmitter<OcorrenciaFormularioComponentTipo> =
      new EventEmitter<OcorrenciaFormularioComponentTipo>();

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
          type: OcorrenciaChangeType.ALTERA_TITULO,
          texto: titulo,
        }));
  }

  /** obtém o ícone a ser mostrado (de ocorrência aberta/fechada) */
  get _iconClass(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-titulo-subtitulo-icon': true,
      'icon-ocorrencia-nao-finalizada':
          this.ocorrencia ? !this.ocorrencia.isEncerrado : false,
      'icon-ocorrencia-finalizada':
          this.ocorrencia ? this.ocorrencia.isEncerrado : false,
    };
  }
}
