import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {Evento} from '../../../model/transport-objects';

@Component({
  selector: 'app-acoes-ligadas-a-novo-comentario',
  templateUrl: './acoes-ligadas-a-novo-comentario.component.html',
  styleUrls: ['./acoes-ligadas-a-novo-comentario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcoesLigadasANovoComentarioComponent {
  /** ocorrencia */
  @Input() ocorrencia: Evento;

  /** texto do novo comentário */
  _textoNovoComentario: string;
  @Input()
  get textoNovoComentario(): string {
    return this._textoNovoComentario;
  }
  set textoNovoComentario(texto: string) {
    this._textoNovoComentario = texto;

    this._textoBotaoReabrir = texto ? 'REABRIR E COMENTAR' : 'REABRIR';
    this._textoBotaoEncerrar = texto ? 'ENCERRAR E COMENTAR' : 'ENCERRAR';
  }

  /** emite quando o botão de reabrir é clicado */
  @Output() reabrirEvento: EventEmitter<string> = new EventEmitter<string>();

  /** emite quando o botão de reabrir é clicado */
  @Output() encerrarEvento: EventEmitter<string> = new EventEmitter<string>();

  /** emite quando o botão de reabrir é clicado */
  @Output() comentar: EventEmitter<string> = new EventEmitter<string>();

  /** texto do botão reabrir */
  _textoBotaoReabrir = 'Reabrir';

  /** texto do botão Encerrar */
  _textoBotaoEncerrar = 'Encerrar';
}
