import {HistoricoInteracao} from './historico-interacao';
import {ObjectReference} from './object-reference';
import {TipoInteracao} from './tipo-interacao';

export enum TipoVisibilidade {
  PARTICIPANTES_ESPECIFICOS,
  SOMENTE_AUTOR,
  SOMENTE_GESTORES,
  SOMENTE_PARTICIPANTES,
  TODOS,
}

export interface Visibilidade {
  tipo: TipoVisibilidade;
  usuarios?: ObjectReference[];
}

export interface Interacao {
  // todo comentário tem um id
  id: string;

  tipoInteracao: TipoInteracao;

  autorRef: ObjectReference;

  dataCriacao: Date | string;

  role: string;

  visibilidade?: Visibilidade;

  historicoInteracoes: HistoricoInteracao[];
}
