import {AbstractDocument} from './abstract-document';

export interface RotuloDoEvento extends AbstractDocument {
  corHexa: string;
  isApagavel?: boolean;
  texto: string;
}
