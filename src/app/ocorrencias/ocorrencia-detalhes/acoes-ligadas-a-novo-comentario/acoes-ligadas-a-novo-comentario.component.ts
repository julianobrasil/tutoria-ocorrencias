import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';

import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../ocorrencia-status-gravacao.service';

import {Evento} from '@model-objects';

@Component({
  selector: 'app-acoes-ligadas-a-novo-comentario',
  templateUrl: './acoes-ligadas-a-novo-comentario.component.html',
  styleUrls: ['./acoes-ligadas-a-novo-comentario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcoesLigadasANovoComentarioComponent implements OnDestroy {
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

  /** true quando estiver acessando o banco */
  _isAcessandoBanco = false;

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

  /** reabre evento */
  _reabreEvento() {
    if (this._isAcessandoBanco) {
      return;
    }

    this._isAcessandoBanco = true;
    this.reabrirEvento.emit(this.textoNovoComentario);
  }

  /** encerra evento */
  _encerraEvento() {
    if (this._isAcessandoBanco) {
      return;
    }

    this._isAcessandoBanco = true;
    this.encerrarEvento.emit(this.textoNovoComentario);
  }

  /** insere novo comentário */
  _comenta() {
    if (this._isAcessandoBanco || !this.textoNovoComentario) {
      return;
    }

    this._isAcessandoBanco = true;

    this.comentar.emit(this.textoNovoComentario);
  }

  /** monitora o status da gravação */
  private _setupMonitoraStatusGravacao() {
    merge(this._statusGravacao.getStatusReaberturaFechamento$(),
          this._statusGravacao.getStatusInsercaoDeComentario$())
        .pipe(takeUntil(this._destroy$))
        .subscribe((status: OcorrenciaDadosDaGravacao) =>
                       (this._isAcessandoBanco = false));
  }
}
