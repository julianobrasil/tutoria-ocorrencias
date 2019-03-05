import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {Evento} from '../model/transport-objects';

export enum OcorrenciaOperacao {
    COMENTA,
    ENCERRA_E_COMENTA,
    REABRE_E_COMENTA,
    NOVO_EVENTO
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
  getReaberturaFechamento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) => status.operacaoExecutada ===
                OcorrenciaOperacao.ENCERRA_E_COMENTA ||
            status.operacaoExecutada ===
                OcorrenciaOperacao.REABRE_E_COMENTA));
  }

  /** emite quando ococorre uma operação de criação de novo comentário */
  getInsercaoDeComentario$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.COMENTA));
  }

  /** emite quando ococorre uma operação de criação de evento */
  getCriacaoDeEvento$() {
    return this.statusGravacao$.pipe(filter(
        (status: OcorrenciaDadosDaGravacao) =>
            status.operacaoExecutada === OcorrenciaOperacao.NOVO_EVENTO));
  }
}
