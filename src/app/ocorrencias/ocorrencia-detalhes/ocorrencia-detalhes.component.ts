// tslint:disable: max-line-length
import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {combineLatest, Observable, of as observableOf, Subject} from 'rxjs';
import {debounceTime, delay, filter, first, map, switchMapTo, takeUntil, tap} from 'rxjs/operators';

import {
  Evento,
  Interacao,
  TextoFormatado,
  TipoInteracao,
  TipoVisibilidade,
  Visibilidade,
} from '../../model/transport-objects';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogComponentData,
} from '../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import {OcorrenciaFormularioComponentTipo} from '../ocorrencia-formulario/ocorrencia-formulario-component.service';
import {FormatadorDeTextoService} from '../shared/utilitarios/formatador-de-texto.service';

import {
  OcorrenciaComentarioChanged,
  OcorrenciaComentarioChangedType,
} from './ocorrencia-comentario/ocorrencia-comentario.component';
import {
  CorDoParticipante,
  OcorrenciaDetalhesComponentService,
  OcorrenciaDetalhesOperation,
} from './ocorrencia-detalhes-component.service';
import {OcorrenciaDetalhesTituloChanged} from './ocorrencia-detalhes-titulo/ocorrencia-detalhes-titulo.component';
import {OcorrenciaFormularioSomenteLeituraChanged} from './ocorrencia-formulario-somente-leitura/ocorrencia-formulario-somente-leitura.component';
// tslint:enable: max-line-length

@Component({
  selector: 'app-ocorrencia-detalhes',
  templateUrl: './ocorrencia-detalhes.component.html',
  styleUrls: ['./ocorrencia-detalhes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaDetalhesComponent implements OnDestroy {
  /** mostra o formulário de um evento */
  _mostraFormulario = false;

  /** evento cujo detalhe está sendo mostrado */
  _ocorrencia$: Observable<Evento>;

  /** obtém o status da gravação do evento quando ocrre reabertura/fechamento */
  _ocorrenciaAposAberturaOuFechamento$: Observable<Evento>;

  /** novo comentario */
  _novoComentario: Interacao;

  /** roles possíveis para o usuário */
  _roles: string[];

  /** cores usadas para os participantes */
  _coresDosParticipantes: CorDoParticipante[];

  /** tipos de interações existentes */
  _tipoInteracaoExistente = TipoInteracao;

  _atrasaAposCargaDeOcorrencia$: Observable<boolean>;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _componentService: OcorrenciaDetalhesComponentService,
    private _dialog: MatDialog,
    private _formatadorDeTextoService: FormatadorDeTextoService,
    private _router: Router,
  ) {
    this._monitoraIdInexistente();

    this._obtemOcorrenciaAPartirDaRota();

    this._configuraCoresDosAvataresDosParticipantes();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    this._componentService.resetaAtualizacaoPeriodica();
  }

  /** exclui o evento corrente */
  _excluiEvento() {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
      .pipe(
        first(),
        map(([evento]) => evento),
      )
      .subscribe((ocorrencia: Evento) => this._componentService.excluiEvento(ocorrencia.id));
  }

  /** altera tipo de evento */
  _alteraTipoEvento(ocorrencia: Evento) {
    this._componentService.alteraTipoEvento(ocorrencia);
  }

  /** trata alterações na ocorrência originadas do formulário somente leitura */
  _ocorrenciaAlteradaNoFormularioSomenteLeitura(evt: OcorrenciaFormularioSomenteLeituraChanged) {
    switch (evt.type) {
      case OcorrenciaDetalhesOperation.ALTERA_LOCAL: {
        this._componentService
          .getLatestValue(this._ocorrencia$)
          .subscribe((ocorrencia: Evento) =>
            this._componentService.alteraLocal(ocorrencia.id, evt.valor),
          );
        break;
      }

      case OcorrenciaDetalhesOperation.ALTERA_UNIDADE: {
        this._componentService
          .getLatestValue(this._ocorrencia$)
          .subscribe((ocorrencia: Evento) =>
            this._componentService.alteraUnidade(ocorrencia.id, evt.valor),
          );
        break;
      }

      case OcorrenciaDetalhesOperation.ALTERA_PARECER: {
        this._componentService
          .getLatestValue(this._ocorrencia$)
          .subscribe((ocorrencia: Evento) =>
            this._componentService.alteraParecer(ocorrencia.id, evt.valor),
          );
        break;
      }
    }
  }

  /** trata alteração no título da ocorrência */
  _tituloDaOcorrenciaAlterado(evt: OcorrenciaDetalhesTituloChanged) {
    switch (evt.type) {
      case OcorrenciaDetalhesOperation.ALTERA_TITULO: {
        this._componentService
          .getLatestValue(this._ocorrencia$)
          .subscribe((ocorrencia: Evento) =>
            this._componentService.alteraTitulo(ocorrencia.id, evt.valor),
          );
        break;
      }
    }
  }

  /**
   * reabre evento (note que o usuário pode abrir e comentar ao mesmo
   * tempo)
   */
  _reabreEvento(textoDoComentario: string) {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
      .pipe(
        first(),
        map(([evento]) => evento),
      )
      .subscribe((ocorrencia: Evento) =>
        this._componentService.reabreEvento(ocorrencia, textoDoComentario),
      );
  }

  /**
   * encerra evento (note que o usuário pode abrir e comentar ao mesmo
   * tempo)
   */
  _encerraEvento(textoDoComentario: string) {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
      .pipe(
        first(),
        map(([evento]) => evento),
      )
      .subscribe((ocorrencia: Evento) =>
        this._componentService.encerraEvento(ocorrencia, textoDoComentario),
      );
  }

  /** insere novo comentário */
  _comenta(textoDoComentario: string) {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
      .pipe(
        first(),
        map(([evento]) => evento),
      )
      .subscribe((ocorrencia: Evento) => {
        this._componentService
          .verificaVisibilidadeDoUltimoComentario$(ocorrencia)
          .subscribe((visibilidade: Visibilidade | null) => {
            if (!visibilidade) {
              this._escolheVisibilidade(ocorrencia, textoDoComentario);
            } else {
              this._componentService.insereComentario(ocorrencia, textoDoComentario, visibilidade);
            }
          });
      });
  }

  /** roteia para o formulário de nova ocorrência */
  _trataNovaOcorrencia(tipoDeNovaOcorrencia: OcorrenciaFormularioComponentTipo) {
    this._router.navigate(['../nova-ocorrencia', tipoDeNovaOcorrencia], {
      relativeTo: this._activatedRoute,
    });
  }

  /** processa solicitações de alteração no comentário */
  _processaAlteracaoNoComentario(comentario: Interacao, alteracao: OcorrenciaComentarioChanged) {
    this._componentService.getLatestValue(this._ocorrencia$).subscribe((ocorrencia: Evento) => {
      switch (alteracao.type) {
        case OcorrenciaComentarioChangedType.VISIBILIDADE: {
          this._componentService.alteraVisibilidade(
            ocorrencia.id,
            comentario.id,
            alteracao.visibilidade,
          );
          break;
        }

        case OcorrenciaComentarioChangedType.TEXTO_COMENTARIO: {
          const textoFormatado: TextoFormatado = {
            markdown: alteracao.texto,
            html: this._formatadorDeTextoService.markdownToHtml(alteracao.texto),
            semFormatacao: this._formatadorDeTextoService.limpaMarkdown(alteracao.texto),
          };

          this._componentService.alteraTextoComentario(
            ocorrencia.id,
            comentario.id,
            textoFormatado,
          );
          break;
        }
      }
    });
  }

  /**
   * configura novo comentário na tela - ainda não sei se é preciso...
   * provavelmente não
   */
  private _setupNovoComentario() {
    const agora: Date = new Date();
    this._novoComentario = {
      tipoInteracao: TipoInteracao.COMENTARIO,
      autorRef: this._componentService.getUsuarioLogadoRef(),
      id: 'novoComentario',
      role: null,
      dataCriacao: new Date(agora),
      historicoInteracoes: [
        {
          data: agora,
          texto: {},
        },
      ],
    };
  }

  /**
   * Verifica se houve erro quando se tentou buscar um Evento a partir do banco.
   * Se houve, vai para a página de listagem de todos os eventos.
   *
   * @private
   * @memberof OcorrenciaDetalhesComponent
   */
  private _monitoraIdInexistente() {
    this._componentService
      .getEventoByIdErro()
      .pipe(
        filter((_) => !!_),
        first(),
        takeUntil(this._destroy$),
      )
      .subscribe((erro: boolean) => (erro ? this._showDialogAndNavigateAway() : null));
  }

  /**
   * Mostra um diálogo informativo e navega para a listagem de ocorrências
   *
   * @private
   * @memberof OcorrenciaDetalhesComponent
   */
  private _showDialogAndNavigateAway() {
    const titulo = 'Evento não encontrado';
    const mensagem = `
      <p>
        Você tentou ver uma ocorrência que provavelmente foi apagada.
      </p>
      <details>
        <summary>Outras causas possíveis</summary>
        <ul>
          <li>Falta de conexão com a Internet</li>
          <li>Problema com a rede</li>
        </ul>
      </details>
    `;

    const data: ConfirmationDialogComponentData = {
      titulo,
      mensagem,
      botaoFalseDisabled: false,
      botaoFalseVisible: true,
      botaoFalseText: 'Fechar',
      botaoTrueVisible: false,
    };

    const dialogRef = this._dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogComponentData,
      boolean
    >(ConfirmationDialogComponent, {data});

    dialogRef
      .afterClosed()
      .subscribe((_) => this._router.navigate(['../'], {relativeTo: this._activatedRoute}));
  }

  /**
   * Analisa a rota, obtém a ocorrência do store e já solicita atualização a
   * partir do banco
   *
   * @private
   * @memberof OcorrenciaDetalhesComponent
   */
  private _obtemOcorrenciaAPartirDaRota() {
    this._activatedRoute.paramMap
      .pipe(
        map((p: ParamMap) => p.get('id')),
        tap((id: string) => {
          this._ocorrencia$ = this._componentService.getEventoById$(id).pipe(debounceTime(300));
          this._atrasaAposCargaDeOcorrencia$ = this._ocorrencia$.pipe(
            switchMapTo(observableOf(true)),
            delay(500),
          );
        }),
        first(),
        takeUntil(this._destroy$),
      )
      .subscribe((id: string) => {
        this._componentService
          .getEventoById$(id)
          .pipe(first())
          .subscribe((evt: Evento) => {
            this._componentService.obtemEventoDoBancoPeriodicamente(id, this._destroy$);

            this._setupNovoComentario();
            this._roles = this._componentService.getUsuarioLogadoRoles(evt);
            this._coresDosParticipantes = [];
          });
      });
  }

  /**
   * Configura cores para os avatares dos participantes (as cores mudam cada vez
   * que o componente é mostrado)
   *
   * @private
   * @memberof OcorrenciaDetalhesComponent
   */
  private _configuraCoresDosAvataresDosParticipantes() {
    this._ocorrencia$
      .pipe(
        filter(Boolean),
        first(),
        takeUntil(this._destroy$),
      )
      .subscribe(
        (evt: Evento) =>
          (this._coresDosParticipantes = this._componentService.setCoresDosParticipantes(
            evt.participantes,
          )),
      );
  }

  /**
   * Diálogo que permite ao usuário escolher a visibilidade dentre 2 opções:
   *
   *     1 - Visível a todos
   *     2 - Visível somente aos gestores
   *
   * @private
   * @param {Evento} ocorrencia
   * @param {string} textoDoComentario
   * @memberof OcorrenciaDetalhesComponent
   */
  private _escolheVisibilidade(ocorrencia: Evento, textoDoComentario: string): void {
    const titulo = 'Visibilidade do comentário';
    const mensagem = `Deseja criar um comentário visível a todos?`;

    const data: ConfirmationDialogComponentData = {
      titulo,
      mensagem,
      botaoFalseDisabled: false,
      botaoFalseText: 'Não, visível somente para os gestores',
      botaoFalseVisible: true,
      botaoTrueDisabled: false,
      botaoTrueText: 'Sim',
      botaoTrueVisible: true,
    };

    const dialogRef = this._dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogComponentData,
      boolean
    >(ConfirmationDialogComponent, {data});

    dialogRef.afterClosed().subscribe((visivelATodos: boolean) => {
      const visibilidade: Visibilidade = visivelATodos
        ? {
            tipo: TipoVisibilidade.TODOS,
          }
        : {
            tipo: TipoVisibilidade.SOMENTE_GESTORES,
          };

      this._componentService.insereComentario(ocorrencia, textoDoComentario, visibilidade);
    });
  }
}
