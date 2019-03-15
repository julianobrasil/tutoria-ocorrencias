import {
  FuncaoDoUsuario,
  Funcoes,
} from '../../model/helper-objects/funcoes-sistema';
import {ObjectReference} from '../model/object-reference';

export interface NewIssueActionButtonData {
  label: string;
  cssClass: string;
  newIssueType: string;
}

export enum ReservedWords {
  NEW_ISSUE_BUTTON_TYPE = 'GENERAL_ISSUE_TYPE',
}

export class IssueTrackerConfiguration {
  usuarioLogado?: {
    usuarioRef?: ObjectReference;
    isAdministrador?: boolean;
  };

  /** Buttons that create new issues */
  get actionButtons(): NewIssueActionButtonData[] {
    return JSON.parse(JSON.stringify(this._actionButtons));
  }
  private _actionButtons: NewIssueActionButtonData[] = [
    {
      label: 'Ocorrência Comum',
      cssClass: '',
      newIssueType: ReservedWords.NEW_ISSUE_BUTTON_TYPE,
    },
  ];

  constructor() {
    this.usuarioLogado = {
      usuarioRef: null,
      isAdministrador: false,
    };
  }

  /** add a new issue action button */
  addNewIssueActionButton(button: NewIssueActionButtonData) {
    if (!button) {
      return this;
    }

    if (button.newIssueType === ReservedWords.NEW_ISSUE_BUTTON_TYPE) {
      return this;
    }

    if (!this._actionButtons) {
      this._actionButtons = [];
    }

    this._actionButtons.push(button);

    return this;
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
