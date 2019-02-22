import {AbstractDocument} from './abstract-document';
import {Curso} from './curso';
export class UsuarioPermissao extends AbstractDocument {
  public nomePermissao = '';
  public email = '';
  public unidade = '';
  public curso: Curso;
  public isoladamente = true;

  constructor() {
    super();
    this.curso = new Curso();
  }
}
UsuarioPermissao['__class'] = 'UsuarioPermissao';
