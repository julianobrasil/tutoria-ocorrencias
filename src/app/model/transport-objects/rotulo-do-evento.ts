import {AbstractDocument} from './abstract-document';
import {TipoRotulo} from './tipo-rotulo';

export interface RotuloDoEvento extends AbstractDocument {
  corHexa: string;

  /** True se o rótulo puder ser apagado pelo usuário */
  isApagavel?: boolean;

  /** True se o rótulo só puder ser aplicados pelo sistema */
  isReservado: boolean;

  /**
   * Um rótulo pode ser:
   *     1 - status de evento
   *     2 - identificação de um comentário
   *     3 - sinalização quaquer
   *     4 - personalizado
   */
  tipos: TipoRotulo[];

  icone?: string;

  /**
   * O rótulo só pode ser aplicado se alguma das dependências forem satisfeitas.
   */
  dependencias: string[];

  /** Descrição do rótulo */
  descricao?: string;

  texto: string;
}
