import {Component, Input, OnInit} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

import {AuthService} from '../../auth/auth.service';
import {ImodbService} from '../../model/servicos/imodb.service';

import {Permissoes} from '../../model/helper-objects/constantes';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public permissaoVerAtividades: boolean;
  public permissaoVerAdministracao: boolean;
  public permissaoVerRelatorios: boolean;
  @Input() public saudacao: string;

  constructor(
    private _authService: AuthService,
    private _imodb: ImodbService,
    private _router: Router,
  ) {
    // let perm: string = this.authService.userPermissionsList;

    // permissão para ver o menu de ativades de tutorias
    this.permissaoVerAtividades = false;
    if (
      this._authService.isUserInRoles([
        Permissoes.REGISTRO_TUTORIA_ALTERAR,
        Permissoes.REGISTRO_TUTORIA_CONSULTAR,
        Permissoes.REGISTRO_TUTORIA_VISUALIZAR,
        Permissoes.ANDAMENTO_TUTORIA_CONSULTAR,
        Permissoes.ANDAMENTO_TUTORIA_VISUALIZAR,
        Permissoes.PARECER_TUTORIA_ALTERAR,
        Permissoes.PARECER_TUTORIA_CONSULTAR,
        Permissoes.PARECER_TUTORIA_VISUALIZAR,
        Permissoes.CADASTRO_TUTORIA_ALTERAR,
        Permissoes.CADASTRO_TUTORIA_CONSULTAR,
        Permissoes.CADASTRO_TUTORIA_VISUALIZAR,
        Permissoes.ADMINISTRACAO_SISTEMA,
      ])
    ) {
      this.permissaoVerAtividades = true;
    }

    // permissão para ver o menu de relatórios
    this.permissaoVerRelatorios = false;
    if (
      this._authService.isUserInRoles([
        Permissoes.RELATORIO_ALTERAR,
        Permissoes.RELATORIO_CONSULTAR,
        Permissoes.RELATORIO_VISUALIZAR,
        Permissoes.RELATORIO_REPRESENTANTES_ALTERAR,
        Permissoes.RELATORIO_REPRESENTANTES_CONSULTAR,
        Permissoes.RELATORIO_REPRESENTANTES_VISUALIZAR,
        Permissoes.RELATORIO_TUTORIAS_ALTERAR,
        Permissoes.RELATORIO_TUTORIAS_CONSULTAR,
        Permissoes.RELATORIO_TUTORIAS_VISUALIZAR,
        Permissoes.ADMINISTRACAO_SISTEMA,
      ])
    ) {
      this.permissaoVerRelatorios = true;
    }

    // permissão para ver o menu de administração do sistema
    this.permissaoVerAdministracao = false;
    if (
      this._authService.isUserInRoles([
        Permissoes.CADASTRO_AREAS_ALTERAR,
        Permissoes.CADASTRO_AREAS_CONSULTAR,
        Permissoes.CADASTRO_AREAS_VISUALIZAR,
        Permissoes.CADASTRO_USUARIO_ALTERAR,
        Permissoes.CADASTRO_USUARIO_CONSULTAR,
        Permissoes.CADASTRO_USUARIO_VISUALIZAR,
        Permissoes.CADASTRO_CONFIG_ALTERAR,
        Permissoes.CADASTRO_CONFIG_CONSULTAR,
        Permissoes.CADASTRO_CONFIG_VISUALIZAR,
        Permissoes.ADMINISTRACAO_SISTEMA,
      ])
    ) {
      this.permissaoVerAdministracao = true;
    }
  }

  ngOnInit() {}

  logout() {
    this._authService.logout();
  }
}
