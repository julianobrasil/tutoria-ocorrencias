import {AbstractDocument} from './abstract-document';
import {Curso} from './curso';
export class UsuarioFuncao extends AbstractDocument {
  public nomeFuncao = '';
  public email = '';
  public unidade = '';
  public curso: Curso;

  constructor() {
    super();
    this.curso = new Curso();
  }
}
UsuarioFuncao['__class'] = 'UsuarioFuncao';
