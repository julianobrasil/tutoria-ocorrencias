import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {Evento} from '../model/transport-objects';

export enum OcorrenciaOperacao {
  ALTERA_LOCAL,
  ALTERA_TITULO,
  COMENTA,
  ENCERRA_E_COMENTA,
  NOVO_EVENTO,
  REABRE_E_COMENTA,
}

export interface OcorrenciaDadosDaGravacao {
  evento?: Evento;
  operacaoExecutada: OcorrenciaOperacao;
  sucesso: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaStatusGravacaoService {
  /** status da gravação */
  statusGravacao$: Subject<OcorrenciaDadosDaGravacao> =
      new Subject<OcorrenciaDadosDaGravacao>();

  /** emite quando ococorre uma operação de reabertura/fechamento */
  getStatusReaberturaFechamento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.ENCERRA_E_COMENTA ||
            status.operacaoExecutada === OcorrenciaOperacao.REABRE_E_COMENTA));
  }

  /** emite quando ococorre uma operação de criação de novo comentário */
  getStatusInsercaoDeComentario$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.COMENTA));
  }

  /** emite quando ococorre uma operação de criação de evento */
  getStatusCriacaoDeEvento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.NOVO_EVENTO));
  }

  /** emite quando ococorre uma operação de alteração do local do evento */
  getStatusAlteracaoDoLocalDoEvento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.ALTERA_LOCAL));
  }

  /** emite quando ococorre uma operação de alteração do título do evento */
  getStatusAlteracaoDoTituloDoEvento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.ALTERA_TITULO));
  }
}
