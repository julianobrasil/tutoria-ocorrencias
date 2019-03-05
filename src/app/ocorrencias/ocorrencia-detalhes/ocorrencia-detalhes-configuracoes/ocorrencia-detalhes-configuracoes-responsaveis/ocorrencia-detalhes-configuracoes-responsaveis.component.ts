import {Component, Input} from '@angular/core';

import {CorDoParticipante} from '../../ocorrencia-detalhes-component.service';

import {Participante} from '../../../../model/transport-objects';

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-responsaveis',
  templateUrl: './ocorrencia-detalhes-configuracoes-responsaveis.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-responsaveis.component.scss'],
})
export class OcorrenciaDetalhesConfiguracoesResponsaveisComponent {
  /** responsáveis */
  @Input()
  responsaveis: Participante[];

  /** cores usadas para os participantes */
  @Input()
  coresDosParticipantes: CorDoParticipante[];

  /** verifica se o usuário logado tem permissão para adicionar responsáveis */
  @Input()
  podeAdicionarResponsaveis = true;

  get _classesDoCabecalho(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-configuracoes-responsaveis-cabecalho': true,
      'active-link': this.podeAdicionarResponsaveis,
    };
  }
}
