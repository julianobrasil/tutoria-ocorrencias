// tslint:disable:max-line-length
import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {combineLatest, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import {Evento, TipoParticipacao} from '../../../model/transport-objects';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogComponentData,
} from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  TipoSubtipoDeEventoDialogComponent,
  TipoSubtipoDeEventoDialogComponentData,
} from '../../shared/componentes/dialogos/tipo-subtipo-de-evento-dialog/tipo-subtipo-de-evento-dialog.component';
import {
  TipoSubtipoDeEventoComponentData,
} from '../../shared/componentes/tipo-subtipo-de-evento/tipo-subtipo-de-evento.component';
import {CorDoParticipante} from '../ocorrencia-detalhes-component.service';

import {OcorrenciaChange, OcorrenciaChangeType} from '../../public_api';
import {
  OcorrenciaDetalhesConfiguracoesComponentService,
} from './ocorrencia-detalhes-configuracoes-component.service';
import {
  OcorrenciaDetalhesConfiguracoesParticipantesChange,
} from './ocorrencia-detalhes-configuracoes-participantes/ocorrencia-detalhes-configuracoes-participantes.component';
import {OcorrenciaDetalhesConfiguracoesRotulosChange} from './ocorrencia-detalhes-configuracoes-rotulos/ocorrencia-detalhes-configuracoes-rotulos.component';
// tslint:enable:max-line-length

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes',
  templateUrl: './ocorrencia-detalhes-configuracoes.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes.component.scss'],
})
export class OcorrenciaDetalhesConfiguracoesComponent implements OnDestroy {
  /** texto do título */
  private _ocorrencia$: Subject<Evento> = new Subject<Evento>();
  private _ocorrencia: Evento;
  @Input()
  get ocorrencia(): Evento {
    return this._ocorrencia;
  }
  set ocorrencia(evt: Evento) {
    this._ocorrencia = evt;

    this._ocorrencia$.next(evt);
  }

  /** cores usadas para os participantes */
  @Input() coresDosParticipantes: CorDoParticipante[];

  /** emite quando o usuário escolhe excluir o evento */
  @Output() excluiEvento: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  eventoChange: EventEmitter<OcorrenciaChange> =
      new EventEmitter<OcorrenciaChange>();

  /** true se for permitido alterar participantes */
  _temPermissaoParaAlterarTipoDeEvento = false;

  /** true se for permitido excluir evento */
  _temPermissaoParaExcluirEvento = false;

  /** tipos de participação disponíveis */
  _tipoDeParticipacao = TipoParticipacao;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _matDialog: MatDialog,
              private _componentService:
                  OcorrenciaDetalhesConfiguracoesComponentService) {
    combineLatest(this._ocorrencia$)
        .pipe(map(([evento]) => evento), takeUntil(this._destroy$))
        .subscribe((evt: Evento) => {
          this._temPermissaoParaExcluirEvento =
              this._componentService.temPermissaoParaExcluirEvento(evt);

          this._temPermissaoParaAlterarTipoDeEvento =
              this._componentService.temPermissaoParaAlterarTipoDeEvento(evt);
        });
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /**
   * Altera tipo de evento
   *
   * @returns
   * @memberof OcorrenciaDetalhesConfiguracoesComponent
   */
  _abreDialogoAlteraTipoEvento() {
    if (!this._temPermissaoParaAlterarTipoDeEvento) {
      return;
    }

    const data: TipoSubtipoDeEventoDialogComponentData = {
      dados: {
        descricaoTipoEvento: this.ocorrencia.descricaoTipoEvento,
        descricaoSubTipoEvento: this.ocorrencia.descricaoSubTipoEvento,
      },
    };

    const dialogRef =
        this._matDialog.open<TipoSubtipoDeEventoDialogComponent,
                             TipoSubtipoDeEventoDialogComponentData,
                             TipoSubtipoDeEventoComponentData>(
            TipoSubtipoDeEventoDialogComponent, {data, width: '60vw'});

    dialogRef.afterClosed().subscribe(
        (dado: TipoSubtipoDeEventoComponentData) => {
          if (!dado) {
            return;
          }

          const ocorrencia: Evento = {
            ...this.ocorrencia,
            descricaoSubTipoEvento: dado.descricaoSubTipoEvento,
            descricaoTipoEvento: dado.descricaoTipoEvento,
          };

          this.eventoChange.emit({
            eventoId: ocorrencia.id,
            type: OcorrenciaChangeType.ALTERA_TIPO_SUBTIPO,
            descricaoSubTipoEvento: dado.descricaoSubTipoEvento,
            descricaoTipoEvento: dado.descricaoTipoEvento,
          });
        });
  }

  /**
   * Trata eventos de alteração de participantes (não oriundos do painel de
   * reponsáveis)
   */
  _alteraParticipantes(change:
                           OcorrenciaDetalhesConfiguracoesParticipantesChange) {
    this.eventoChange.emit({
      type: OcorrenciaChangeType.ALTERA_PARTICIPANTES,
      eventoId: this.ocorrencia.id,
      participantesAdicionados: change.participantesAdicionados,
      participantesRemovidos: change.participantesRemovidos,
    });
  }

  /**
   * Trata eventos de alteração de rótulos.
   */
  _alteraRotulos(change: OcorrenciaDetalhesConfiguracoesRotulosChange) {
    this.eventoChange.emit({
      type: OcorrenciaChangeType.ALTERA_ROTULOS,
      eventoId: this.ocorrencia.id,
      rotulosAdicionadosIds: change.rotulosAdicionadosIds,
      rotulosRemovidosIds: change.rotulosRemovidosIds,
    });
  }

  /**
   * Trata eventos de alteração de participantes (não oriundos do painel de
   * reponsáveis)
   */
  _alteraResponsaveis(change:
                          OcorrenciaDetalhesConfiguracoesParticipantesChange) {
    this.eventoChange.emit({
      type: OcorrenciaChangeType.ALTERA_RESPONSAVEIS,
      eventoId: this.ocorrencia.id,
      participantesAdicionados: change.participantesAdicionados,
      participantesRemovidos: change.participantesRemovidos,
    });
  }

  /**
   * Abre diálogo perguntando se a exclusão pode continuar
   *
   * @returns
   * @memberof OcorrenciaDetalhesConfiguracoesComponent
   */
  _abreDialogoConfirmExclusaoEvento() {
    if (!this._temPermissaoParaExcluirEvento) {
      return;
    }

    const titulo = 'Exclusão de ocorrência';
    const mensagem = `
      <p>Você solicitou a exclusão desta ocorrência. Esta ação é irreversível.</p>
      <p class="app-text-center">Tem certeza disso?</p>
    `;
    const data: ConfirmationDialogComponentData = {
      titulo,
      mensagem,
      botaoFalseDisabled: false,
      botaoFalseVisible: true,
      botaoFalseText: 'Mudei de idéia, não quero mais excluir',
      botaoTrueDisabled: false,
      botaoTrueVisible: true,
      botaoTrueText: 'Pode excluir',
    };
    const dialogRef =
        this._matDialog.open<ConfirmationDialogComponent,
                             ConfirmationDialogComponentData, boolean>(
            ConfirmationDialogComponent, {data});

    dialogRef.afterClosed().subscribe(
        (podeExcluir: boolean) =>
            podeExcluir && this._temPermissaoParaExcluirEvento ?
                this.excluiEvento.emit() :
                null);
  }
}
