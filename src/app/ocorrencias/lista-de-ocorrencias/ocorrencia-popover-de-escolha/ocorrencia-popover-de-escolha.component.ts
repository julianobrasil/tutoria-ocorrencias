import {Component, EventEmitter, Output} from '@angular/core';
import {SatPopover} from '@ncstate/sat-popover';

import {
  OcorrenciaFormularioComponentTipo,
} from '../../ocorrencia-formulario/ocorrencia-formulario-component.service';

@Component({
  selector: 'app-ocorrencia-popover-de-escolha',
  templateUrl: './ocorrencia-popover-de-escolha.component.html',
  styleUrls: ['./ocorrencia-popover-de-escolha.component.scss'],
})
export class OcorrenciaPopoverDeEscolhaComponent {
  /** tipo de ocorrência a ser emitido */
  @Output()
  novaOcorrencia: EventEmitter<OcorrenciaFormularioComponentTipo> =
      new EventEmitter<OcorrenciaFormularioComponentTipo>();

  /**
   * abre popover de opções ou dispara a criação de um novo evento comum,
   * dependendo da função do usuário
   */
  _novaOcorrencia(popover: SatPopover) { popover.open(); }

  /** emite solicitação de criação de novo evento de tutoria */
  _novaOcorrenciaTutoria(popover: SatPopover) {
    this.novaOcorrencia.emit(OcorrenciaFormularioComponentTipo.TUTORIA);
    popover.close();
  }

  /** emite solicitação de criação de novo evento comum */
  _novaOcorrenciaComum(popover: SatPopover) {
    this.novaOcorrencia.emit(
        OcorrenciaFormularioComponentTipo.OCORRENCIA_COMUM);
    popover.close();
  }
}
