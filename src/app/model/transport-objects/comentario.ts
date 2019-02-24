import {HistoricoComentario} from './historico-comentario';
import {ObjectReference} from './object-reference';

export interface Comentario {
  // todo comentário tem um id
  id: string;

  autorRef: ObjectReference;

  dataCriacao: Date | string;

  dataModificacao?: Date | string;

  historicoComentario: HistoricoComentario[];
}
