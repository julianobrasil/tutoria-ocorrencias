import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Evento, Interacao, Visibilidade} from '../../../model/transport-objects';
import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../ocorrencia-status-gravacao.service';

export enum OcorrenciaComentarioChangedType {
  TEXTO_COMENTARIO,
  VISIBILIDADE,
}

export interface OcorrenciaComentarioChanged {
  type: OcorrenciaComentarioChangedType;
  visibilidade?: Visibilidade;
  texto?: string;
}

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

  /** indica se o compontene está sendo editado ou não */
  @Input() isEditando = false;

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
  comentarioChanged: EventEmitter<OcorrenciaComentarioChanged> = new EventEmitter<
    OcorrenciaComentarioChanged
  >();

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _statusGravacao: OcorrenciaStatusGravacaoService) {
    this._setupMonitoraStatusGravacao();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
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
