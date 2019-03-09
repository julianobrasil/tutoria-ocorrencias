// tslint:disable: max-line-length
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Evento} from '../../../model/transport-objects';
import {LocalDialogComponent, LocalDialogComponentData} from '../../shared/componentes/dialogos/local-dialog/local-dialog.component';
import {UnidadeDialogComponent, UnidadeDialogComponentData} from '../../shared/componentes/dialogos/unidade-dialog/unidade-dialog.component';
import {OcorrenciaDetalhesOperation} from '../ocorrencia-detalhes-component.service';
// tslint:enable: max-line-length

export interface OcorrenciaFormularioSomenteLeituraChanged {
  type: OcorrenciaDetalhesOperation;
  valor: string;
}

@Component({
  selector: 'app-ocorrencia-formulario-somente-leitura',
  templateUrl: './ocorrencia-formulario-somente-leitura.component.html',
  styleUrls: ['./ocorrencia-formulario-somente-leitura.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaFormularioSomenteLeituraComponent {
  /** evento cujos detalhes deve ser mostrado */
  @Input() ocorrencia: Evento;

  /** cor do avatar do participante */
  @Input() corDoAvatar: string;

  /** true se a fonte do avatar for branca */
  @Input() isTextoDoAvatarBranco = false;

  /** emite quando o alguma característica é alterada */
  @Output()
  ocorrenciaChanged: EventEmitter<OcorrenciaFormularioSomenteLeituraChanged> =
      new EventEmitter<OcorrenciaFormularioSomenteLeituraChanged>();

  /** apresenta botão de alterar local */
  _mostraBotaoAlterarLocal = false;

  /** apresenta botão de alterar unidade */
  _mostraBotaoAlterarUnidade = false;

  constructor(private _dialog: MatDialog) {}

  /** abre diálogo de alterar o local */
  _mostaDialogoDeAlterarLocal() {
    const data: LocalDialogComponentData = {
      local: this.ocorrencia.local,
    };

    const dialogRef =
        this._dialog
            .open<LocalDialogComponent, LocalDialogComponentData, string>(
                LocalDialogComponent, {data, width: '400px'});

    dialogRef.afterClosed().subscribe(
        (local: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaDetalhesOperation.ALTERA_LOCAL,
          valor: local,
        }));
  }

  /** abre diálogo de alterar a unidade */
  _mostaDialogoDeAlterarUnidade() {
    const data: UnidadeDialogComponentData = {
      unidade: this.ocorrencia.cidadeUnidade,
    };

    const dialogRef =
        this._dialog
            .open<UnidadeDialogComponent, UnidadeDialogComponentData, string>(
                UnidadeDialogComponent, {data, width: '400px'});

    dialogRef.afterClosed().subscribe(
        (unidade: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaDetalhesOperation.ALTERA_UNIDADE,
          valor: unidade,
        }));
  }

  /** a unidade não pode ser alterada no caso de tutoria */
  get _podeAlterarUnidade(): boolean {
    return !this.ocorrencia.tutoria && this._mostraBotaoAlterarUnidade;
  }
}
