// tslint:disable: max-line-length
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {merge, Subject} from 'rxjs';
import {debounceTime, takeUntil} from 'rxjs/operators';

import {Evento, Interacao} from '../../../../model/transport-objects';
import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../../ocorrencia-status-gravacao.service';
import {
  OcorrenciaComentarioChanged,
  OcorrenciaComentarioChangedType,
} from '../ocorrencia-comentario.component';

// tslint:enable: max-line-length
export interface TextareaEvent {
  event: Event;
  eventType: string;
}

@Component({
  selector: 'app-ocorrencia-comentario-edicao',
  templateUrl: './ocorrencia-comentario-edicao.component.html',
  styleUrls: ['./ocorrencia-comentario-edicao.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaComentarioEdicaoComponent implements OnDestroy {
  /** comentário a ser mostrado */
  private _markdownDoUltimoComentario: string;
  private _comentarioMarkdown: string;
  @Input()
  get comentarioMarkdown(): string {
    return this._comentarioMarkdown;
  }
  set comentarioMarkdown(i: string) {
    this._comentarioMarkdown = i ? i : '';

    this._markdownDoUltimoComentario = this._comentarioMarkdown;

    this._comentarioEmEdicaoCtrl.setValue(this._markdownDoUltimoComentario);
  }

  /** ocorrência dona do comentário */
  @Input() ocorrencia: Evento;

  /** mostra os botões de ação no rodapé do componente */
  @Input() mostraBotoesDeAcao = true;

  /** cancela edição do comentário */
  @Output() cancelaEdicao: EventEmitter<void> = new EventEmitter<void>();

  /** emite sempre que o texto do comentário for alterado */
  @Output()
  textoDoComentarioChange: EventEmitter<string> = new EventEmitter<string>();

  /** Emite quando há alterações no comentário. */
  @Output()
  comentarioChanged: EventEmitter<OcorrenciaComentarioChanged> =
      new EventEmitter<OcorrenciaComentarioChanged>();

  /** controle do comentário que estiver sendo criado/editado */
  _comentarioEmEdicaoCtrl: FormControl =
      new FormControl(['', Validators.required]);

  /** quando o botão de gravar deve ser desabilitado */
  _botaoGravarDesabilitado = true;

  /** CkEditor */
  _editor = ClassicEditor;

  /**
   * Botões da toolbar:
   *
   * POSSIBILIDADES: [
   *   '|', 'undo', 'redo', 'bold', 'italic', 'blockQuote', 'ckfinder',
   *   'imageTextAlternative', 'imageUpload', 'heading', 'imageStyle:full',
   *   'imageStyle:side', 'link', 'numberedList', 'bulletedList', 'mediaEmbed',
   *   'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells'
   * ]
   */
  _botoesDaToolbar: string[] = [
    'heading',
    '|',
    'bold',
    'italic',
    'numberedList',
    'bulletedList',
    'insertTable',
  ];

  /** configurações do CkEditor */
  _config: {[key: string]: string | string[]} = {
    language: 'pt-br',
    toolbar: this._botoesDaToolbar,
  };

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _cd: ChangeDetectorRef,
              private _statusGravacao: OcorrenciaStatusGravacaoService) {
    this._comentarioEmEdicaoCtrl.valueChanges.pipe(debounceTime(300),
                                                   takeUntil(this._destroy$))
        .subscribe((value: string) => {
          this.textoDoComentarioChange.emit(value);

          this._botaoGravarDesabilitado =
              this._comentarioEmEdicaoCtrl.invalid ||
              this._comentarioEmEdicaoCtrl.value ===
                  this._markdownDoUltimoComentario;
          this._cd.markForCheck();
        });

    this._setupMonitoraStatusGravacao();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /** cancela a edição */
  _cancelaEdicao() {
    this._comentarioEmEdicaoCtrl.reset();
    this.cancelaEdicao.emit();
  }

  /** atualiza comentário */
  _atualizaComentario() {
    if (this._comentarioEmEdicaoCtrl.invalid) {
      return;
    }

    this.comentarioChanged.emit({
      type: OcorrenciaComentarioChangedType.TEXTO_COMENTARIO,
      texto: this._comentarioEmEdicaoCtrl.value,
    });
  }

  /** monitora o status da gravação */
  private _setupMonitoraStatusGravacao() {
    merge(this._statusGravacao.getStatusReaberturaFechamento$(),
          this._statusGravacao.getStatusInsercaoDeComentario$())
        .pipe(takeUntil(this._destroy$))
        .subscribe(
            (status: OcorrenciaDadosDaGravacao) =>
                status.sucesso ? this._comentarioEmEdicaoCtrl.reset() : null);
  }
}
