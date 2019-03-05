import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-acoes',
  templateUrl: './ocorrencia-detalhes-configuracoes-acoes.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-acoes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaDetalhesConfiguracoesAcoesComponent {
  /** usuário pode alterar o tipo do evento */
  @Input()
  mostraAcaoAlterarTipoDoEvento: true;

  /** usuário pode excluir o evento */
  @Input()
  mostraAcaoExcluirEvento: true;

  /** emite quando o usuário escolhe excluir o evento */
  @Output()
  excluiEvento: EventEmitter<void> = new EventEmitter<void>();

  /** emite quando o usuário escolhe alterar o tipo de evento */
  @Output()
  alteraTipoDeEvento: EventEmitter<void> = new EventEmitter<void>();
}
