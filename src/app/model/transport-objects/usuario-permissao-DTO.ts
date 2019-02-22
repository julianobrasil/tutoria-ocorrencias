import {Curso} from './curso';
import {Permissao} from './permissao';
import {Usuario} from './usuario';
export class UsuarioEPermissaoDTO {
  public usuario: Usuario;
  public permissao: Permissao;
  public unidade = '';
  public curso: Curso;

  constructor() {
    this.usuario = new Usuario();
    this.permissao = new Permissao();
    this.curso = new Curso();
  }
}

UsuarioEPermissaoDTO['__class'] = 'UsuarioEPermissaoDTO';
