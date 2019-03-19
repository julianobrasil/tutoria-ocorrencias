import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-search-bar-botao-filtro',
  templateUrl: './search-bar-botao-filtro.component.html',
  styleUrls: ['./search-bar-botao-filtro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarBotaoFiltroComponent {
  /** Mostra o botão de limpar */
  @Input() mostraBotaoLimparFiltro = false;

  /** Emite quando o botão de ação é clicado */
  @Output()
  clicked: EventEmitter<MouseEvent | KeyboardEvent> =
      new EventEmitter<MouseEvent | KeyboardEvent>();

  /** Emite quando o botão de remover é clicado */
  @Output()
  cleared: EventEmitter<MouseEvent | KeyboardEvent> =
      new EventEmitter<MouseEvent | KeyboardEvent>();

  /**
   * Emite quando o botão de remover é clicado sem disparar o botão de
   * ação
   */
  _clearClicked(evt: MouseEvent | KeyboardEvent) {
    evt.stopPropagation();

    this.cleared.emit(evt);
  }
}
