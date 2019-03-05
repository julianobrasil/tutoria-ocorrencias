import {TextoFormatado} from './texto-formatado';
import {TipoAcao} from './tipo-acao';

/**
 * Grava todas as alterações em um comentário
 *
 * @export
 * @interface HistoricoComentario
 */
export interface HistoricoInteracao {
  data: Date|string;

  texto?: TextoFormatado;

  tipoAcao?: TipoAcao|undefined|null;
}
