import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {Evento} from '@model-objects';

import {OcorrenciaChangeType} from './public_api';

export interface OcorrenciaDadosDaGravacao {
  evento?: Evento;
  operacaoExecutada: OcorrenciaChangeType;
  sucesso: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaStatusGravacaoService {
  /** status da gravação */
  statusGravacao$: Subject<OcorrenciaDadosDaGravacao> = new Subject<OcorrenciaDadosDaGravacao>();

  /** emite quando ococorre uma operação de reabertura/fechamento */
  getStatusReaberturaFechamento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ENCERRA_E_COMENTA ||
          status.operacaoExecutada === OcorrenciaChangeType.REABRE_E_COMENTA,
      ),
    );
  }

  /** emite quando ococorre uma operação de criação de novo comentário */
  getStatusInsercaoDeComentario$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.COMENTA,
      ),
    );
  }

  /** emite quando ococorre uma operação de criação de evento */
  getStatusCriacaoDeEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.NOVO_EVENTO,
      ),
    );
  }

  /** emite quando ococorre uma operação de alteração do local do evento */
  getStatusAlteracaoDoLocalDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_LOCAL,
      ),
    );
  }

  /** emite quando ococorre uma operação de alteração da unidade do evento */
  getStatusAlteracaoDoUnidadeDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_UNIDADE,
      ),
    );
  }

  /** emite quando ococorre uma operação de alteração do título do evento */
  getStatusAlteracaoDoTituloDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_TITULO,
      ),
    );
  }

  /**
   * Emite quando ococorre uma operação de alteração da visibilidade da uma
   * interação (geralmente um comentário)
   */
  getStatusAlteracaoDaVisibilidadeDaInteracao$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.VISIBILIDADE_COMENTARIO,
      ),
    );
  }

  /**
   * Emite quando ococorre uma operação de alteração da visibilidade do evento
   */
  getStatusAlteracaoDaVisibilidadeDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.VISIBILIDADE_EVENTO,
      ),
    );
  }

  /**
   * emite quando ococorre uma operação de alteração no texto de um comentário
   */
  getStatusAlteracaoDeTextoDoComentario$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.TEXTO_COMENTARIO,
      ),
    );
  }

  /**
   * emite quando ococorre uma operação de alteração no texto principal da
   * ocorrência
   */
  getStatusAlteracaoDeParecerDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_PARECER,
      ),
    );
  }

  /**
   * emite quando ococorre uma operação de alteração dos participantes da
   * ocorrência
   */
  getStatusAlteracaoDeParticipantesDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_PARTICIPANTES,
      ),
    );
  }

  /**
   * emite quando ococorre uma operação de alteração dos responsáveis da
   * ocorrência
   */
  getStatusAlteracaoDeResponsaveisDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_RESPONSAVEIS,
      ),
    );
  }

  /**
   * emite quando ococorre uma operação de alteração dos rótulos da
   * ocorrência
   */
  getStatusAlteracaoDeRotulosDoEvento$() {
    return this.statusGravacao$.pipe(
      filter(
        (status: OcorrenciaDadosDaGravacao) =>
          status.operacaoExecutada === OcorrenciaChangeType.ALTERA_ROTULOS,
      ),
    );
  }
}
