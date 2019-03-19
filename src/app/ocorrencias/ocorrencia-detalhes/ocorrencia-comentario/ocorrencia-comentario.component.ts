import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {debounceTime, filter, map, takeUntil} from 'rxjs/operators';

import {Evento, Interacao, Visibilidade} from '@model-objects';
import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../ocorrencia-status-gravacao.service';
import {OcorrenciaDetalhesComponentService} from '../ocorrencia-detalhes-component.service';

import {OcorrenciaChange} from '../../public_api';

@Component({
  selector: 'app-ocorrencia-comentario',
  templateUrl: './ocorrencia-comentario.component.html',
  styleUrls: ['./ocorrencia-comentario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ocorrenciaComentario',
})
export class OcorrenciaComentarioComponent implements OnDestroy {
  /** comentário a ser mostrado */
  @Input() comentario: Interacao;

  /** ocorrência dona do comentário */
  @Input() ocorrencia: Evento;

  /** quando for true, o componente funcionará somente para edição */
  @Input()
  get somenteEdicao(): boolean {
    return this._somenteEdicao;
  }
  set somenteEdicao(value: boolean) {
    this._somenteEdicao = value;
    this._somenteEdicao$.next(value);
  }
  private _somenteEdicao = false;
  private _somenteEdicao$: Subject<boolean> = new Subject<boolean>();

  /** indica se o compontene está sendo editado ou não */
  @Input()
  get isEditando(): boolean {
    return this._isEditando;
  }
  set isEditando(value: boolean) {
    this._isEditando = value;
    this._isEditando$.next(value);
  }
  private _isEditando = false;
  private _isEditando$: Subject<boolean> = new Subject<boolean>();

  /** indica os papeis possíveis */
  @Input() roles: string[];

  /** cor do avatar do participante */
  @Input() corDoAvatar: string;

  /** true se a fonte do avatar for branca */
  @Input() isTextoDoAvatarBranco: boolean;

  /** emite sempre que o texto do comentário for alterado */
  @Output()
  textoDoComentarioChange: EventEmitter<string> = new EventEmitter<string>();

  /** mostra os botões de ação no rodapé do componente */
  @Input() mostraBotoesDeAcao = true;

  /** Emite quando há alterações no comentário. */
  @Output()
  comentarioChanged: EventEmitter<OcorrenciaChange> = new EventEmitter<OcorrenciaChange>();

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _ocorrenciaDetalhesComponentService: OcorrenciaDetalhesComponentService,
    private _statusGravacao: OcorrenciaStatusGravacaoService,
  ) {
    this._setupMonitoraStatusGravacao();

    combineLatest(this._isEditando$, this._somenteEdicao$)
      .pipe(
        filter(([isEditando, justForEdit]) => !justForEdit),
        debounceTime(300),
        map(([isEditando, justForEdit]) => isEditando),
        takeUntil(this._destroy$),
      )
      .subscribe((isEditando: boolean) =>
        this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(isEditando),
      );
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._isEditando$ && !this._isEditando$.closed) {
      this._isEditando$.complete();
    }

    if (this._somenteEdicao$ && !this._somenteEdicao$.closed) {
      this._somenteEdicao$.complete();
    }
  }

  /** monitora o status da gravação */
  private _setupMonitoraStatusGravacao() {
    this._statusGravacao
      .getStatusAlteracaoDeTextoDoComentario$()
      .pipe(takeUntil(this._destroy$))
      .subscribe((status: OcorrenciaDadosDaGravacao) => (this.isEditando = !status.sucesso));
  }
}
