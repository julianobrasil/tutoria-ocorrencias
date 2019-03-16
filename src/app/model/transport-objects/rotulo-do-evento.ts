import {AbstractDocument} from './abstract-document';

export interface RotuloDoEvento extends AbstractDocument {
  corHexa: string;
  isApagavel?: boolean;

  /** Rótulos reservados só podem ser aplicados pelo sistema */
  isReservado: boolean;

  texto: string;
}
