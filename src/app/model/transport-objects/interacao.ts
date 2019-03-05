import {HistoricoInteracao} from './historico-interacao';
import {ObjectReference} from './object-reference';
import {TipoInteracao} from './tipo-interacao';

export interface Interacao {
  // todo comentário tem um id
  id: string;

  tipoInteracao: TipoInteracao;

  autorRef: ObjectReference;

  dataCriacao: Date|string;

  role: string;

  historicoInteracoes: HistoricoInteracao[];
}
