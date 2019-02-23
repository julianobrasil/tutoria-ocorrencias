import {AbstractDocument} from './abstract-document';
export class Unidade extends AbstractDocument {
  public cidade = '';
  public unidade = '';

  constructor() {
    super();
  }
}

Unidade['__class'] = 'Unidade';
