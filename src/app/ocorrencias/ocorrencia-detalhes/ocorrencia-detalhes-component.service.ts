import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subject, timer} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import * as fromDiarioDeTutoriaStore from '../../../store/diario-de-tutoria';
import {AuthService} from '../../auth/auth.service';
import {Funcoes} from '../../model/helper-objects/funcoes-sistema';
import {ImodbService} from '../../model/servicos/imodb.service';
import {ObjectReference, Participante, TipoParticipacao} from '../../model/transport-objects';
import {Coordenador, Evento, Responsavel, Tutor} from '../../model/transport-objects/';
import {GeradorDeCoresService} from '../shared/utilitarios/gerador-de-cores.service';

export interface CorDoParticipante {
  usuarioRef: ObjectReference;
  codigoCorHexadecimal: string;
  isTextoDoAvatarBranco: boolean;
}

export enum OcorrenciaDetalhesOperation {
  REABRE_E_COMENTA,
  ENCERRA_E_COMENTA,
}

export interface OcorrenciaDetalhesSavingStatus {
  success: boolean;
  operationExecuted: OcorrenciaDetalhesOperation;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaDetalhesComponentService {

  constructor(
      private _authService: AuthService,
      private _geradorDeCoresService: GeradorDeCoresService,
      private _store$: Store<{}>,
      public _imodb: ImodbService,
  ) {}

  /** tipos de evento disponíveis */
  getEventoById$(id: string): Observable<Evento> {
    return this._store$.pipe(
        select(fromDiarioDeTutoriaStore.SELECTORS.EVENTO.getEventoById, {id}));
  }

  /** obtém evento direto do banco de dados */
  obtemEventoDoBancoPeriodicamente(id: string, destroy$: Subject<void>): void {
    timer(0, 5000)
        .pipe(takeUntil(destroy$))
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
                    codigoCorHexadecimal,
                    ),
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
  insereComentario(ocorrencia: Evento, textoComentario: string): void {
    this._store$.dispatch(
      new fromDiarioDeTutoriaStore.ACTIONS.EVENTO.InsereComentarioRun({
        eventoId: ocorrencia.id,
        textoComentario,
      }));
  }

  /** verifica se ou usuário logado é tutor */
  private _isTutor(historicoTutores: Tutor[]): boolean {
    return historicoTutores.some(
        (tutor: Tutor) =>
            !tutor.dataFim && tutor.email === this._authService.email,
    );
  }

  /** verifica se ou usuário logado é coordenador */
  private _isCoordenador(coordenadores: Coordenador[]): boolean {
    return coordenadores.some(
        (coordenador: Coordenador) =>
            coordenador.email === this._authService.email,
    );
  }

  /** verifica se ou usuário logado é responsável */
  private _isResponsavel(responsaveis: Responsavel[]): boolean {
    return responsaveis.some(
        (responsavel: Responsavel) =>
            responsavel.email === this._authService.email,
    );
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
            participante.tipoParticipacao === TipoParticipacao.CONVIDADO,
    );
  }
}
