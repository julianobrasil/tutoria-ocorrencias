import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Evento} from '../../../model/transport-objects';
import {
  LocalDialogComponent,
  LocalDialogComponentData,
} from '../../shared/componentes/dialogos/local-dialog/local-dialog.component';
import {
  OcorrenciaDetalhesOperation,
} from '../ocorrencia-detalhes-component.service';

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

  /** emite quando o local é alterado */
  @Output()
  ocorrenciaChanged: EventEmitter<OcorrenciaFormularioSomenteLeituraChanged> =
      new EventEmitter<OcorrenciaFormularioSomenteLeituraChanged>();

  /** apresenta botão de alterar local */
  _mostraBotaoAlterarLocal = false;

  constructor(private _dialog: MatDialog) {}

  /** abre diálogo de alterar o local */
  _mostaDialogoDeAlterarLocal() {
    const data: LocalDialogComponentData = {
      local: this.ocorrencia.local,
    };

    const dialogRef =
        this._dialog.open<LocalDialogComponent, LocalDialogComponentData,
                          string>(LocalDialogComponent, {data, width: '400px'});

    dialogRef.afterClosed().subscribe(
        (local: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaDetalhesOperation.ALTERA_LOCAL,
          valor: local,
        }));
  }
}
