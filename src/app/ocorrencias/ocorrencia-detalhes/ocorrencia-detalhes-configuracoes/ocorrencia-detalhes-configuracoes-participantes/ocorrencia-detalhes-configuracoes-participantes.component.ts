import {Component, Input} from '@angular/core';

import {Participante} from '../../../../model/transport-objects';
import {CorDoParticipante} from '../../ocorrencia-detalhes-component.service';

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-participantes',
  templateUrl: './ocorrencia-detalhes-configuracoes-participantes.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-participantes.component.scss'],
})
export class OcorrenciaDetalhesConfiguracoesParticipantesComponent {
  /** responsáveis */
  @Input()
  participantes: Participante[];

  /** cores usadas para os participantes */
  @Input()
  coresDosParticipantes: CorDoParticipante[];

  /** verifica se o usuário logado tem permissão para adicionar responsáveis */
  @Input()
  podeAdicionarParticipantes = true;

  get _classesDoCabecalho(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-configuracoes-participantes-cabecalho': true,
      'active-link': this.podeAdicionarParticipantes,
    };
  }
}
