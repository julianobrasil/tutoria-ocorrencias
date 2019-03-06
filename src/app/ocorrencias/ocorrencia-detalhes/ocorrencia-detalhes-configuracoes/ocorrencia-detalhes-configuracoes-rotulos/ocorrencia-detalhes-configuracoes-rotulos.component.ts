import {Component, Input, ViewEncapsulation} from '@angular/core';

import {ClassificacaoEvento, Evento} from '../../../../model/transport-objects';

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-rotulos',
  templateUrl: './ocorrencia-detalhes-configuracoes-rotulos.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-rotulos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaDetalhesConfiguracoesRotulosComponent {
  /** rótulos */
  @Input() ocorrencia: Evento;

  /**
   * verifica se o usuário logado tem permissão para adicionar/remover rótulos
   */
  @Input() podeAdicionarRotulos = false;

  _classificacaoEvento = ClassificacaoEvento;

  get _classesDoCabecalho(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-configuracoes-rotulos-cabecalho': true,
      'active-link': this.podeAdicionarRotulos,
    };
  }
}
