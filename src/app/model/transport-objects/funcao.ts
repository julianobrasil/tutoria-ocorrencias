import {AbstractDocument} from './abstract-document';
export class Funcao extends AbstractDocument {
  public nomeFuncao = '';
  public permissoes: string[];
  public nomeAmigavelDoOcupante = '';
  public nomeAmigavelFuncao = '';

  constructor() {
    super();
    this.permissoes = [];
  }
}
Funcao['__class'] = 'Funcao';
