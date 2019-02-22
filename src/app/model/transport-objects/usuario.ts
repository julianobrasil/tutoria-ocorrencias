import {AbstractDocument} from './abstract-document';
export class Usuario extends AbstractDocument {
  public email = '';
  public nomeUsuario = '';
  public senha = '';
  public validadeSenha: Date = new Date();
  public matricula = '';
  public primeiroAcesso = false;
  public ativo = false;

  constructor() {
    super();
    this.ativo = true;
  }
}
Usuario['__class'] = 'Usuario';
