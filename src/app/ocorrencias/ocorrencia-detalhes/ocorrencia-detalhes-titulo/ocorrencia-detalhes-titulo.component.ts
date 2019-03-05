import {Component, Input} from '@angular/core';

import {Evento} from '../../../model/transport-objects';

@Component({
  selector: 'app-ocorrencia-detalhes-titulo',
  templateUrl: './ocorrencia-detalhes-titulo.component.html',
  styleUrls: ['./ocorrencia-detalhes-titulo.component.scss'],
})
export class OcorrenciaDetalhesTituloComponent {
  /** texto do título */
  @Input() ocorrencia: Evento;

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
