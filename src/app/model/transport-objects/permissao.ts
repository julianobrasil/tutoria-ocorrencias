import {AbstractDocument} from './abstract-document';
export class Permissao extends AbstractDocument {
  public nomePermissao = '';
  public descricao = '';

  constructor() {
    super();
  }
}

Permissao['__class'] = 'Permissao';
