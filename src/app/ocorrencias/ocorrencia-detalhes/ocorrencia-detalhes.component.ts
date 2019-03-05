import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {combineLatest, Observable, of as observableOf, Subject} from 'rxjs';
import {debounceTime, delay, filter, first, map, switchMapTo, takeUntil, tap} from 'rxjs/operators';
import {ConfirmationDialogComponent, ConfirmationDialogComponentData} from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';

import {Evento, Interacao, TipoInteracao} from '../../model/transport-objects';

import {CorDoParticipante, OcorrenciaDetalhesComponentService} from './ocorrencia-detalhes-component.service';

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
  }

  /** exclui o evento corrente */
  _excluiEvento() {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
        .pipe(
            first(),
            map(([evento]) => evento),
            )
        .subscribe(
            (ocorrencia: Evento) =>
                this._componentService.excluiEvento(ocorrencia.id));
  }

  /** altera tipo de evento */
  _alteraTipoEvento(ocorrencia: Evento) {
    this._componentService.alteraTipoEvento(ocorrencia);
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
        .subscribe(
            (ocorrencia: Evento) => this._componentService.reabreEvento(
                ocorrencia, textoDoComentario));
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
        .subscribe(
            (ocorrencia: Evento) => this._componentService.encerraEvento(
                ocorrencia, textoDoComentario));
  }

  /** insere novo comentário */
  _comenta(textoDoComentario: string) {
    combineLatest(this._ocorrencia$.pipe(filter(Boolean)))
        .pipe(
            first(),
            map(([evento]) => evento),
            )
        .subscribe(
            (ocorrencia: Evento) => this._componentService.insereComentario(
                ocorrencia, textoDoComentario));
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
    this._componentService.getEventoByIdErro()
        .pipe(filter((_) => !!_), first(), takeUntil(this._destroy$))
        .subscribe(
            (erro: boolean) => erro ? this._showDialogAndNavigateAway() : null);
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
        ConfirmationDialogComponent, ConfirmationDialogComponentData, boolean>(
        ConfirmationDialogComponent, {data});

    dialogRef.afterClosed().subscribe(
        (_) =>
            this._router.navigate(['../'], {relativeTo: this._activatedRoute}));
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
              this._ocorrencia$ =
                  this._componentService.getEventoById$(id).pipe(
                      debounceTime(300));
              this._atrasaAposCargaDeOcorrencia$ = this._ocorrencia$.pipe(
                  switchMapTo(observableOf(true)), delay(500));
            }),
            first(),
            takeUntil(this._destroy$),
            )
        .subscribe((id: string) => {
          this._componentService.getEventoById$(id).pipe(first()).subscribe(
              (evt: Evento) => {
                this._componentService.obtemEventoDoBancoPeriodicamente(
                    id, this._destroy$);

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
                (this._coresDosParticipantes =
                     this._componentService.setCoresDosParticipantes(
                         evt.participantes,
                         )),
        );
  }
}
