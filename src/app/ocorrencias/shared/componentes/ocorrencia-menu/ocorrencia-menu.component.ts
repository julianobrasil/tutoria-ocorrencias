// tslint:disable: max-line-length
import {Component, EventEmitter, Input, Output} from '@angular/core';

import {
  Evento,
  Interacao,
  TipoVisibilidade,
} from '../../../../model/transport-objects';
// tslint:enable: max-line-length

@Component({
  selector: 'app-ocorrencia-menu',
  templateUrl: './ocorrencia-menu.component.html',
  styleUrls: ['./ocorrencia-menu.component.scss'],
})
export class OcorrenciaMenuComponent {
  /**
   * indica que o menu está sendo mostrado no cabeçalho do evento ao invés de
   * em um outro comentário
   */
  @Input() isCabecalhoEvento = false;

  /** ocorrencia em questão */
  @Input() ocorrencia: Evento;

  /** comentário em questão */
  @Input() comentario: Interacao;

  /** emite uma solicitação de alteração de local */
  @Output() alteraLocal: EventEmitter<void> = new EventEmitter<void>();

  /** emite uma solicitação de alteração de unidade */
  @Output() alteraUnidade: EventEmitter<void> = new EventEmitter<void>();

  /** emite uma solicitação de alteração de visibilidade */
  @Output() tornaVisivel: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** emite uma solicitação de alteração de texto */
  @Output() alteraTexto: EventEmitter<void> = new EventEmitter<void>();

  /** mostra o botão de esconder */
  get _mostraBotaoDeEsconder(): boolean {
    return !this.isCabecalhoEvento && !!this.comentario &&
           !!this.comentario.visibilidade &&
           this.comentario.visibilidade.tipo === TipoVisibilidade.TODOS;
  }

  /** mostra o botão de mostrar */
  get _mostraBotaoDeMostrar(): boolean {
    return !this.isCabecalhoEvento && !!this.comentario &&
           !!this.comentario.visibilidade &&
           this.comentario.visibilidade.tipo !== TipoVisibilidade.TODOS;
  }

  /** mostra o divider logo abaixo dos botões de visibilidade */
  get _mostraDividerAbaixoDeVisibilidade(): boolean {
    return !this.isCabecalhoEvento &&
           (this._mostraBotaoDeEsconder || this._mostraBotaoDeMostrar);
  }

  /** TODO(@julianobrasil) retorna true se o texto puder ser alterado */
  get _mostraAlterarTexto(): boolean { return true; }
}
