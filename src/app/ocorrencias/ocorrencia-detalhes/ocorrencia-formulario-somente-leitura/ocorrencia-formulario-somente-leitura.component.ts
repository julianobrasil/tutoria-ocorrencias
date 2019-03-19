// tslint:disable: max-line-length
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {MatDialog} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
  Evento,
  TipoVisibilidade,
  Visibilidade,
} from '@model-objects';
import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../../ocorrencia-status-gravacao.service';
import {
  LocalDialogComponent,
  LocalDialogComponentData,
} from '../../shared/componentes/dialogos/local-dialog/local-dialog.component';
import {
  UnidadeDialogComponent,
  UnidadeDialogComponentData,
} from '../../shared/componentes/dialogos/unidade-dialog/unidade-dialog.component';
import {
  OcorrenciaDetalhesComponentService,
} from '../ocorrencia-detalhes-component.service';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogComponentData,
} from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import {OcorrenciaChange, OcorrenciaChangeType} from '../../public_api';
// tslint:enable: max-line-length

export interface OcorrenciaFormularioSomenteLeituraChanged {
  type: OcorrenciaChangeType;
  valor?: string;
  visibilidade?: Visibilidade;
}

@Component({
  selector: 'app-ocorrencia-formulario-somente-leitura',
  templateUrl: './ocorrencia-formulario-somente-leitura.component.html',
  styleUrls: ['./ocorrencia-formulario-somente-leitura.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaFormularioSomenteLeituraComponent implements OnDestroy {
  /** evento cujos detalhes deve ser mostrado */
  @Input() ocorrencia: Evento;

  /** cor do avatar do participante */
  @Input() corDoAvatar: string;

  /** true se a fonte do avatar for branca */
  @Input() isTextoDoAvatarBranco = false;

  /** emite quando o alguma característica é alterada */
  @Output()
  ocorrenciaChanged: EventEmitter<OcorrenciaFormularioSomenteLeituraChanged> =
      new EventEmitter<OcorrenciaFormularioSomenteLeituraChanged>();

  /** apresenta botão de alterar local */
  _mostraBotaoAlterarLocal = false;

  /** apresenta botão de alterar unidade */
  _mostraBotaoAlterarUnidade = false;

  /** mostra editor */
  get mostraEditor(): boolean { return this._mostraEditor; }
  set mostraEditor(value: boolean) {
    this._mostraEditor = value;

    this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(
        value);
  }
  private _mostraEditor = false;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _dialog: MatDialog,
              private _ocorrenciaStatusGravacaoService:
                  OcorrenciaStatusGravacaoService,
              private _ocorrenciaDetalhesComponentService:
                  OcorrenciaDetalhesComponentService) {
    this._setupMonitoraStatusGravacao();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  _suspendeAtualizacaoPeriodicaDaTela(interrompeAtualizacao: boolean) {
    this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(
        interrompeAtualizacao);
  }

  /** altera o parecer da ocorrência */
  _alteraComentario(change: OcorrenciaChange) {
    this.ocorrenciaChanged.emit({
      type: OcorrenciaChangeType.ALTERA_PARECER,
      valor: change.texto,
    });
  }

  /** abre diálogo de alterar o local */
  _mostaDialogoDeAlterarLocal() {
    const data: LocalDialogComponentData = {
      local: this.ocorrencia.local,
    };

    const dialogRef =
        this._dialog
            .open<LocalDialogComponent, LocalDialogComponentData, string>(
                LocalDialogComponent, {data, width: '400px'});

    dialogRef.afterClosed().subscribe(
        (local: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaChangeType.ALTERA_LOCAL,
          valor: local,
        }));
  }

  /** abre diálogo de alterar a unidade */
  _mostaDialogoDeAlterarUnidade() {
    const data: UnidadeDialogComponentData = {
      unidade: this.ocorrencia.cidadeUnidade,
    };

    const dialogRef =
        this._dialog
            .open<UnidadeDialogComponent, UnidadeDialogComponentData, string>(
                UnidadeDialogComponent, {data, width: '400px'});

    dialogRef.afterClosed().subscribe(
        (unidade: string) => this.ocorrenciaChanged.emit({
          type: OcorrenciaChangeType.ALTERA_UNIDADE,
          valor: unidade,
        }));
  }

  _abreDialogoAlteraVisibilidade(tornaVisivel: boolean) {
    if (!tornaVisivel) {
      this._alteraVisibilidadeEvento(tornaVisivel);

      return;
    }

    const titulo = 'Alteração de visibilidade';

    const mensagem = `
      <p>Esta ocorrência ficará visível para todos.</p>
      <p class="app-text-center">Deseja Continuar?</p>
    `;
    const data: ConfirmationDialogComponentData = {
      titulo,
      mensagem,
      botaoFalseDisabled: false,
      botaoFalseText: 'Não, mudei de ideia',
      botaoFalseVisible: true,
      botaoTrueDisabled: false,
      botaoTrueText: 'Sim, quero',
      botaoTrueVisible: true,
    };

    const dialogRef =
        this._dialog.open<ConfirmationDialogComponent,
                          ConfirmationDialogComponentData, boolean>(
            ConfirmationDialogComponent, {data});

    dialogRef.afterClosed().subscribe(
        (isContinuar: boolean) =>
            isContinuar ? this._alteraVisibilidadeEvento(tornaVisivel) :
                          null);
  }

  /**
   * Altera a visibilidade do evento
   *
   * @private
   * @param {boolean} tornaVisivel
   * @memberof OcorrenciaFormularioSomenteLeituraComponent
   */
  private _alteraVisibilidadeEvento(tornaVisivel: boolean): void {
    this.ocorrenciaChanged.emit({
      type: OcorrenciaChangeType.VISIBILIDADE_EVENTO,
      visibilidade: {
        tipo: tornaVisivel ? TipoVisibilidade.TODOS :
                             TipoVisibilidade.SOMENTE_PARTICIPANTES,
      },
    });
  }

  /** a unidade não pode ser alterada no caso de tutoria */
  get _podeAlterarUnidade(): boolean {
    return !this.ocorrencia.tutoria && this._mostraBotaoAlterarUnidade;
  }

  /** Muda a cor da barra de título se a visibilidade estiver limitada */
  get _isVisibilidadeLimitada(): boolean {
    return (this.ocorrencia && this.ocorrencia.visibilidade &&
            this.ocorrencia.visibilidade.tipo !== TipoVisibilidade.TODOS);
  }

  /** monitora a gravação do comentário */
  private _setupMonitoraStatusGravacao() {
    this._ocorrenciaStatusGravacaoService.getStatusAlteracaoDeParecerDoEvento$()
        .pipe(takeUntil(this._destroy$))
        .subscribe((status: OcorrenciaDadosDaGravacao) =>
                       (this.mostraEditor = !status.sucesso));
  }
}
