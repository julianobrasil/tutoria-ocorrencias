import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import {Subject} from 'rxjs';

import {
  Evento,
  Interacao,
  TipoVisibilidade,
} from '@model-objects';
import {
  OcorrenciaDetalhesComponentService,
} from '../../ocorrencia-detalhes-component.service';

import {OcorrenciaChange, OcorrenciaChangeType} from '../../../public_api';

@Component({
  selector: 'app-ocorrencia-comentario-visualizacao',
  templateUrl: './ocorrencia-comentario-visualizacao.component.html',
  styleUrls: ['./ocorrencia-comentario-visualizacao.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaComentarioVisualizacaoComponent implements OnDestroy {
  /** comentário a ser mostrado */
  @Input() comentario: Interacao;

  /** ocorrência dona do comentário */
  @Input() ocorrencia: Evento;

  /** indica os papeis possíveis */
  @Input() roles: string[];

  /**
   * Emite uma solicitação de alteração de texto. Na solicitação indica a
   * altura do texto em px;
   */
  @Output() alteraTexto: EventEmitter<string> = new EventEmitter<string>();

  /** Emite quando há alterações no comentário. */
  @Output()
  comentarioChanged: EventEmitter<OcorrenciaChange> =
      new EventEmitter<OcorrenciaChange>();

  /** elemento que contém o texto */
  @ViewChild('sectionComTexto') _sectionComTexto: ElementRef;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _ocorrenciaDetalhesComponentService:
                  OcorrenciaDetalhesComponentService) {}

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  _interrompeAtualizacaoDaTela(isMenuAberto: boolean) {
    this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(
        isMenuAberto);
  }

  /** altera visibilidade do comentário */
  _alteraVisibilidadeDoComentario(tornaVisivel: boolean) {
    this.comentarioChanged.emit({
      type: OcorrenciaChangeType.VISIBILIDADE_COMENTARIO,
      visibilidade: {
        ...this.comentario.visibilidade,
        tipo: tornaVisivel ? TipoVisibilidade.TODOS :
                             TipoVisibilidade.SOMENTE_GESTORES,
      },
    });
  }

  /**
   * Emite quando se deseja alterar o comentário, informando a altura da
   * section que contém o texto
   */
  _alteraTextoDoComentario() {
    this.alteraTexto.emit(this._setupTextareaHeight());
  }

  /** exclui o comentário */
  _excluiInteracao() {
    this.comentarioChanged.emit({
      eventoId: this.ocorrencia.id,
      comentarioId: this.comentario.id,
      type: OcorrenciaChangeType.EXCLUI_COMENTARIO,
    });
  }

  /** true se a visibilidade do comentário for limitada */
  get _isVisibilidadeLimitada(): boolean {
    return (this.comentario && this.comentario.visibilidade &&
            this.comentario.visibilidade.tipo !== TipoVisibilidade.TODOS);
  }

  /** obtém a altura atual da `<section>` que contém o texto */
  private _setupTextareaHeight(): string {
    const component: HTMLElement =
        this._sectionComTexto.nativeElement as HTMLElement;

    const rect: ClientRect | DOMRect = component.getBoundingClientRect();

    return `${rect.height - 30}px`;
  }
}
