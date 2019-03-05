import {ObjectReference} from './object-reference';

export enum TipoParticipacao {
  CONVIDADO = 'CONVIDADO',
  COORDENADOR = 'COORDENADOR',
  DELEGADO = 'DELEGADO',
  DIRETOR = 'DIRETOR',
  GERAL = 'GERAL', // quando o autor não for um tutor
  QUALIDADE = 'QUALIDADE',
  RESPONSAVEL = 'RESPONSAVEL',
  TUTOR = 'TUTOR',
}

/**
 * Dados do participante das conversas de um evento
 *
 * @export
 * @interface Participante
 */
export interface Participante {
  tipoParticipacao: TipoParticipacao;
  usuarioRef: ObjectReference;
  isAutor: boolean;
}
