import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Evento, Interacao} from '../../../model/transport-objects';
import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../ocorrencia-status-gravacao.service';

@Component({
  selector: 'app-ocorrencia-comentario',
  templateUrl: './ocorrencia-comentario.component.html',
  styleUrls: ['./ocorrencia-comentario.component.scss'],
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

  /** controle do comentário que estiver sendo criado/editado */
  _comentarioEmEdicaoCtrl: FormControl = new FormControl();

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _statusGravacao: OcorrenciaStatusGravacaoService) {
    this._comentarioEmEdicaoCtrl.valueChanges.pipe(takeUntil(this._destroy$))
        .subscribe((value: string) => this.textoDoComentarioChange.emit(value));

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
    merge(this._statusGravacao.getStatusReaberturaFechamento$(),
          this._statusGravacao.getStatusInsercaoDeComentario$())
        .pipe(takeUntil(this._destroy$))
        .subscribe((status: OcorrenciaDadosDaGravacao) =>
                       status.sucesso ? this._comentarioEmEdicaoCtrl.reset() :
                                        null);
  }
}
