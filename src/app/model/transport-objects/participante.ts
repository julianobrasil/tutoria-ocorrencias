import {ObjectReference} from './object-reference';

export enum TipoDeParticipacao {
  CONVIDADO = 'CONVIDADO',
  COORDENADOR = 'COORDENADOR',
  DIRETOR = 'DIRETOR',
  QUALIDADE = 'QUALIDADE',
  RESPONSAVEL = 'RESPONSAVEL',
  TUTOR = 'TUTOR',
  DELEGADO = 'DELEGADO',
}

/**
 * Dados do participante das conversas de um evento
 *
 * @export
 * @interface Participante
 */
export interface Participante {
  tipo: TipoDeParticipacao;
  usuarioRef: ObjectReference;
  isAutor: boolean;
}
