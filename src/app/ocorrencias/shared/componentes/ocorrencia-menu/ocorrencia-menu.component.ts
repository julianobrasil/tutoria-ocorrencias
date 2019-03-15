// tslint:disable: max-line-length
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {MatMenuTrigger} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaMenuComponent implements AfterViewInit,
    OnDestroy {
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

  /** emite uma solicitação de exclusão da interação */
  @Output() excluiInteracao: EventEmitter<void> = new EventEmitter<void>();

  /** emite true quando o menu for aberto e false quando for fechado */
  @Output() menuAberto: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** trigger do mat menu */
  @ViewChild(MatMenuTrigger) _trigger: MatMenuTrigger;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  ngAfterViewInit(): void {
    this._trigger.menuClosed.pipe(takeUntil(this._destroy$))
        .subscribe(() => this.menuAberto.emit(false));
    this._trigger.menuOpened.pipe(takeUntil(this._destroy$))
        .subscribe(() => this.menuAberto.emit(true));
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /** mostra o botão de esconder */
  get _mostraBotaoDeEsconder(): boolean {
    return (this.ocorrencia && this.ocorrencia.visibilidade &&
            this.ocorrencia.visibilidade.tipo === TipoVisibilidade.TODOS) ||
           (!!this.comentario && !!this.comentario.visibilidade &&
            this.comentario.visibilidade.tipo === TipoVisibilidade.TODOS);
  }

  /** mostra o botão de mostrar */
  get _mostraBotaoDeMostrar(): boolean {
    return (this.ocorrencia && this.ocorrencia.visibilidade &&
            this.ocorrencia.visibilidade.tipo !== TipoVisibilidade.TODOS) ||
           (!!this.comentario && !!this.comentario.visibilidade &&
            this.comentario.visibilidade.tipo !== TipoVisibilidade.TODOS);
  }

  /** mostra o divider logo abaixo dos botões de visibilidade */
  get _mostraDividerAbaixoDeVisibilidade(): boolean {
    return (this._mostraBotaoDeEsconder || this._mostraBotaoDeMostrar);
  }

  /** TODO(@julianobrasil) retorna true se o texto puder ser alterado */
  get _mostraAlterarTexto(): boolean { return true; }
}
