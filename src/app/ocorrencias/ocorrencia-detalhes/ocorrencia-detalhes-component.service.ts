import {Injectable, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, interval, Observable, Subject, timer} from 'rxjs';
import {
  bufferWhen,
  debounceTime,
  filter,
  first,
  map,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import * as fromDiarioDeTutoriaStore from '../../../store/diario-de-tutoria';
import * as fromGeralStore from '../../../store/geral';
import {AuthService} from '../../auth/auth.service';
import {Funcoes} from '../../model/helper-objects/funcoes-sistema';
import {ImodbService} from '../../model/servicos/imodb.service';
import {
  Interacao,
  ObjectReference,
  Participante,
  TextoFormatado,
  TipoInteracao,
  TipoParticipacao,
  Visibilidade,
} from '../../model/transport-objects';
import {
  Coordenador,
  Evento,
  Responsavel,
  Tutor,
} from '../../model/transport-objects/';
import {
  FormatadorDeTextoService,
} from '../shared/utilitarios/formatador-de-texto.service';
import {
  GeradorDeCoresService,
} from '../shared/utilitarios/gerador-de-cores.service';

export interface CorDoParticipante {
  usuarioRef: ObjectReference;
  codigoCorHexadecimal: string;
  isTextoDoAvatarBranco: boolean;
}

export enum OcorrenciaDetalhesOperation {
  REABRE_E_COMENTA,
  ENCERRA_E_COMENTA,
  ALTERA_LOCAL,
  ALTERA_TITULO,
  ALTERA_UNIDADE,
  ALTERA_PARECER,
}

export interface OcorrenciaDetalhesSavingStatus {
  success: boolean;
  operationExecuted: OcorrenciaDetalhesOperation;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaDetalhesComponentService implements OnDestroy {
  /** emite true quando houver uma inteção de edição em andamento */
  private _interromperAtualizacaoPeriodica = 0;
  private _interromperAtualizacaoPeriodica$: Subject<boolean> =
      new Subject<boolean>();

  constructor(private _authService: AuthService,
              private _formatadorDeTextoService: FormatadorDeTextoService,
              private _geradorDeCoresService: GeradorDeCoresService,
              private _store$: Store<{}>, public _imodb: ImodbService) {
    this._setupAtualizacaoPeriodica();
  }

  ngOnDestroy() {
    if (this._interromperAtualizacaoPeriodica$ &&
        !this._interromperAtualizacaoPeriodica$.closed) {
      this._interromperAtualizacaoPeriodica$.complete();
    }
  }

  /** informa que uma está em andamento */
  interrompeAtualizacaoPeriodica(interrompeAtualizacaoPeriodica: boolean) {
    this._interromperAtualizacaoPeriodica$.next(interrompeAtualizacaoPeriodica);
  }

  /** reinicializa a autalização períodica */
  resetaAtualizacaoPeriodica() { this._interromperAtualizacaoPeriodica = 0; }

  /** obtém o úlgimo valor emitido pelo observable passado como parâmetro */
  getLatestValue<T>(value$: Observable<T>): Observable<T> {
    return combineLatest(value$).pipe(map(([value]) => value), first());
  }

  /** tipos de evento disponíveis */
  getEventoById$(id: string): Observable<Evento> {
    return this._store$.pipe(
        select(fromDiarioDeTutoriaStore.SELECTORS.EVENTO.getEventoById, {id}));
  }

  /** obtém evento direto do banco de dados */
  obtemEventoDoBancoPeriodicamente(id: string, destroy$: Subject<void>): void {
    timer(0, environment.production ? 5000 : 5000)
        .pipe(filter((_) => !this._interromperAtualizacaoPeriodica),
              takeUntil(destroy$))
        .subscribe(
            (_) => this._store$.dispatch(
                new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.ObtemEventoPorIdRun(
                    {id})));
  }

  /**
   * retorna o status de erro do evento por id (quando tenta pegar do banco e
   * dá erro)
   */
  getEventoByIdErro(): Observable<boolean> {
    return this._store$.pipe(
        select(fromDiarioDeTutoriaStore.SELECTORS.EVENTO.getEventoByIdErro));
  }

  /** obtém um ObjectReference com os dados do usuário logado */
  getUsuarioLogadoRef(): ObjectReference {
    return {
      code: this._authService.email,
      description: this._authService.nomeUsuario,
    };
  }

  /** configura as cores dos participantes */
  setCoresDosParticipantes(participantes: Participante[]): CorDoParticipante[] {
    if (!participantes) {
      return [];
    }

    const coresUsadas: Set<string> = new Set<string>();
    const coresDosParticipantes: CorDoParticipante[] =
        participantes.map((p: Participante) => {
          let codigoCorHexadecimal = '';
          do {
            codigoCorHexadecimal = this._geradorDeCoresService.materialColor();
            if (!coresUsadas.has(codigoCorHexadecimal)) {
              coresUsadas.add(codigoCorHexadecimal);
              break;
            }
          } while (coresUsadas.has(codigoCorHexadecimal));
          coresUsadas.add(codigoCorHexadecimal);

          return {
            usuarioRef: p.usuarioRef,
            codigoCorHexadecimal,
            isTextoDoAvatarBranco:
                this._geradorDeCoresService.isContrastOkToWhite(
                    codigoCorHexadecimal),
          };
        });

    return coresDosParticipantes;
  }

  /** obtém os papéis desempenhados pelo usuário logado */
  getUsuarioLogadoRoles(evt: Evento): string[] {
    if (!evt) {
      return [];
    }

    const roles: string[] = [];

    if (evt.tutoria && this._isTutor(evt.tutoria.historicoTutores)) {
      roles.push(Funcoes.TUTOR.funcaoSistema);
    }

    if (evt.tutoria && this._isCoordenador(evt.tutoria.coordenadores)) {
      roles.push(Funcoes.COORDENACAO.funcaoSistema);
    }

    if (this._isResponsavel(evt.responsaveis)) {
      roles.push(Funcoes.RESPONSAVEL.funcaoSistema);
    }

    if (this._isQualidade()) {
      roles.push(Funcoes.QUALIDADE.funcaoSistema);
    }

    if (this._isDiretor()) {
      roles.push(Funcoes.DIRETOR.funcaoSistema);
    }

    if (this._isConvidado(evt.participantes)) {
      roles.push(Funcoes.CONVIDADO.funcaoSistema);
    }

    return roles;
  }

  /** exclui evento */
  excluiEvento(eventoId: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.ExcluiEventoRun(
            {eventoId}));
  }

  /** altera evento */
  alteraTipoEvento(ocorrencia: Evento): any {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraTipoDeEventoRun({
          eventoId: ocorrencia.id,
          descricaoTipoEvento: ocorrencia.descricaoTipoEvento,
          descricaoSubTipoEvento: ocorrencia.descricaoSubTipoEvento,
        }));
  }

  /**
   * Altera o local da ocorrência
   *
   * @param {string} eventoId
   * @param {string} local
   * @memberof OcorrenciaDetalhesComponentService
   */
  alteraLocal(eventoId: string, local: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraLocalDoEventoRun({
            eventoId, local,
        }));
  }

  /**
   * Altera a unidade da ocorrência
   *
   * @param {string} id
   * @param {string} valor
   * @memberof OcorrenciaDetalhesComponentService
   */
  alteraUnidade(eventoId: string, unidade: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraUnidadeDoEventoRun({
            eventoId, unidade,
        }));
  }

  /**
   * Altera o título do evento
   *
   * @param {string} eventoId
   * @param {string} titulo
   * @memberof OcorrenciaDetalhesComponentService
   */
  alteraTitulo(eventoId: string, titulo: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraTituloDoEventoRun({
            eventoId, titulo,
        }));
  }

  alteraParecer(eventoId: string, parecerMarkdown: string): void {
    const textoFormatado: TextoFormatado = {
      markdown: parecerMarkdown,
      html: this._formatadorDeTextoService.markdownToHtml(parecerMarkdown),
      semFormatacao:
          this._formatadorDeTextoService.limpaMarkdown(parecerMarkdown),
    };

    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraParecerDaInteracaoRun(
            {
                eventoId, textoFormatado,
            }));
  }

  /**
   * Torna um comentário visível para todos
   *
   * @param {string} eventoId
   * @param {string} interacaoId
   * @param {boolean} tornaComentarioVisivel
   * @memberof OcorrenciaDetalhesComponentService
   */
  alteraVisibilidade(eventoId: string, interacaoId: string,
                     visibilidade: Visibilidade): void {
    this._store$.dispatch(new fromDiarioDeTutoriaStore.ACTIONS.EVENTO
                              .AlteraVisibilidadeDaInteracaoRun({
                                  eventoId, interacaoId, visibilidade,
                              }));
  }

  /**
   * Reabre evento que estava fechado. Note que o usuário pode rebrir e comentar
   * em uma única ação.
   *
   * @param {Evento} ocorrencia
   * @param {string} textoComentario
   * @memberof OcorrenciaDetalhesComponentService
   */
  reabreEvento(ocorrencia: Evento, textoComentario: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.ReabreEventoRun({
          eventoId: ocorrencia.id,
          textoComentario,
        }));
  }

  /**
   * Encerra um evento com um comentário (opcional)
   *
   * @param {Evento} ocorrencia
   * @param {string} textoComentario
   * @memberof OcorrenciaDetalhesComponentService
   */
  encerraEvento(ocorrencia: Evento, textoComentario: string): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.EncerraEventoRun({
          eventoId: ocorrencia.id,
          textoComentario,
        }));
  }

  /**
   * Insere um novo comentário no evento
   *
   * @param {Evento} ocorrencia
   * @param {string} textoComentario
   * @memberof OcorrenciaDetalhesComponentService
   */
  insereComentario(ocorrencia: Evento, textoComentario: string,
                   visibilidade: Visibilidade): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.InsereComentarioRun({
          eventoId: ocorrencia.id,
          textoComentario,
          visibilidade,
        }));
  }

  /**
   * Altera texto do comentário
   *
   * @param {string} eventoId
   * @param {string} interacaoId
   * @param {TextoFormatado} textoFormatado
   * @memberof OcorrenciaDetalhesComponentService
   */
  alteraTextoComentario(eventoId: string, interacaoId: string,
                        textoFormatado: TextoFormatado): void {
    this._store$.dispatch(
        new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.AlteraTextoDeComentarioRun({
            eventoId, interacaoId, textoFormatado,
        }));
  }

  /**
   * Vefirica qual a última visibilidade do usuário logado
   *
   * @param {Evento} ocorrencia
   * @returns {Observable<Visibilidade>}
   * @memberof OcorrenciaDetalhesComponentService
   */
  verificaVisibilidadeDoUltimoComentario$(ocorrencia: Evento):
      Observable<Visibilidade> {
    return this._store$.pipe(
        select(fromGeralStore.SELECTORS.DADOS_DO_USUARIO_LOGADO.getUsuarioRef),
        map((usuarioRef: ObjectReference) => {
          if (!usuarioRef) {
            return null;
          }

          const interacoes: Interacao[] =
              ocorrencia.interacoes.filter((i: Interacao) =>
                                               i.tipoInteracao ===
                                                   TipoInteracao.COMENTARIO &&
                                               i.autorRef.code ===
                                                   usuarioRef.code)
                  .sort((a, b) => new Date(b.dataCriacao).getTime() -
                                  new Date(a.dataCriacao).getTime());

          return interacoes.length ? interacoes[0].visibilidade : null;
        }),
        first());
  }

  /** verifica se ou usuário logado é tutor */
  private _isTutor(historicoTutores: Tutor[]): boolean {
    return historicoTutores.some((tutor: Tutor) =>
                                     !tutor.dataFim &&
                                     tutor.email === this._authService.email);
  }

  /** verifica se ou usuário logado é coordenador */
  private _isCoordenador(coordenadores: Coordenador[]): boolean {
    return coordenadores.some((coordenador: Coordenador) =>
                                  coordenador.email ===
                                  this._authService.email);
  }

  /** verifica se ou usuário logado é responsável */
  private _isResponsavel(responsaveis: Responsavel[]): boolean {
    return responsaveis.some((responsavel: Responsavel) =>
                                 responsavel.email === this._authService.email);
  }

  /** verifica se ou usuário logado é da qualidade */
  private _isQualidade(): boolean {
    return this._authService.userFunctionsList.includes(
        Funcoes.QUALIDADE.funcaoSistema);
  }

  /** verifica se ou usuário logado é da diretoria */
  private _isDiretor(): boolean {
    return this._authService.userFunctionsList.includes(
        Funcoes.DIRETOR.funcaoSistema);
  }

  /** verifica se ou usuário logado é responsável */
  private _isConvidado(participantes: Participante[]): boolean {
    return participantes.some(
        (participante: Participante) =>
            participante.usuarioRef.code === this._authService.email &&
            participante.tipoParticipacao === TipoParticipacao.CONVIDADO);
  }

  /**
   * Toda vez que um evento true é recebido em
   * _interromperAtualizacaoPeriodica$, o contador
   * this._interromperAtualizacaoPeriodica é incrementado. Quando um evento
   * false é recebido, ele é decrementado.
   *
   * @private
   * @memberof OcorrenciaDetalhesComponentService
   */
  private _setupAtualizacaoPeriodica() {
    // não há necessidade do takeUntil aqui porque o subject
    // _interromperAtualizacaoPeriodica$ completa no OnDestroy
    this._interromperAtualizacaoPeriodica$
        .pipe(tap((interrompe: boolean) =>
                      interrompe ? this._interromperAtualizacaoPeriodica++ :
                                   this._interromperAtualizacaoPeriodica--))
        .subscribe();
  }
}
