// tslint:disable-next-line: no-implicit-dependencies
import {ObjectReference} from '@model-objects';
import {
  FuncaoDoUsuario,
  Funcoes,
} from '../../model/helper-objects/funcoes-sistema';

export class IssueTrackerConfiguration {
  usuarioLogado?: {
    usuarioRef?: ObjectReference;
    isAdministrador?: boolean;
  };

  constructor() {
    this.usuarioLogado = {
      usuarioRef: null,
      isAdministrador: false,
    };
  }

  /** configura o usuario (usuarioRef) */
  fillUpUserData(userRef: ObjectReference) {
    this.usuarioLogado.usuarioRef = userRef;
    return this;
  }

  /** configura o papel do usuário como administrador */
  fillUpRoles(funcoesDoUsuario: FuncaoDoUsuario[]) {
    this.usuarioLogado.isAdministrador =
        funcoesDoUsuario.some((f: FuncaoDoUsuario) => f.funcoes.includes(
                                  Funcoes.ADMINISTRADOR.funcaoSistema));
    return this;
  }
}
