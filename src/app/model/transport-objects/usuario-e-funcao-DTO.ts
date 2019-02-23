import {AbstractDocument} from './abstract-document';
import {Curso} from './curso';
import {Funcao} from './funcao';
import {Usuario} from './usuario';
export class UsuarioEFuncaoDTO extends AbstractDocument {
  public usuario: Usuario;
  public funcao: Funcao;
  public unidade = '';

  constructor() {
    super();
    this.usuario = new Usuario();
    this.funcao = new Funcao();
  }
}

UsuarioEFuncaoDTO['__class'] = 'UsuarioEFuncaoDTO';
