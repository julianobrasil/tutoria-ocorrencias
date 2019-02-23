import {Injectable} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  NavigationExtras,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {AuthService} from '../auth.service';

import {Permissoes} from '../../model/helper-objects/constantes';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    return true; // this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return true; // this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    return true;

    const url = `/${route.path}`;
    // console.log(`url origem: ${this.router.routerState.}`);
    return this.checkLogin(url) && this.checkAuthorization(url);
  }

  checkAuthorization(url: string) {
    // console.log(`URL: ${url}`);
    if (url === '/administracao') {
      if (
        this.authService.isUserInRoles([
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
        return true;
      }
    }

    if (url === '/tutoria') {
      if (
        this.authService.isUserInRoles([
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
          Permissoes.CADASTRO_AREAS_ALTERAR,
          Permissoes.CADASTRO_AREAS_CONSULTAR,
          Permissoes.CADASTRO_AREAS_VISUALIZAR,
          Permissoes.CADASTRO_USUARIO_ALTERAR,
          Permissoes.CADASTRO_USUARIO_CONSULTAR,
          Permissoes.CADASTRO_USUARIO_VISUALIZAR,
          Permissoes.CADASTRO_CONFIG_ALTERAR,
          Permissoes.CADASTRO_CONFIG_CONSULTAR,
          Permissoes.CADASTRO_CONFIG_VISUALIZAR,
          Permissoes.RELATORIO_REPRESENTANTES_CONSULTAR,
          Permissoes.RELATORIO_REPRESENTANTES_ALTERAR,
          Permissoes.RELATORIO_REPRESENTANTES_VISUALIZAR,
          Permissoes.ADMINISTRACAO_SISTEMA,
        ])
      ) {
        return true;
      }
    }

    if (url === '/relatorios') {
      if (
        this.authService.isUserInRoles([
          Permissoes.RELATORIO_ALTERAR,
          Permissoes.RELATORIO_CONSULTAR,
          Permissoes.RELATORIO_VISUALIZAR,
          Permissoes.RELATORIO_REPRESENTANTES_CONSULTAR,
          Permissoes.RELATORIO_REPRESENTANTES_ALTERAR,
          Permissoes.RELATORIO_REPRESENTANTES_VISUALIZAR,
          Permissoes.ADMINISTRACAO_SISTEMA,
        ])
      ) {
        return true;
      }
    }

    return false;
  }

  checkLogin(url: string): boolean {
    // console.log(`verificando autorização: ${this.authService.isLoggedIn}`);
    if (this.authService.isLoggedIn) {
      // console.log('o usuário está logado');
      return true;
    }
    // console.log('o usuário NÃO está logado');
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Create a dummy session id
    //  const sessionId = 123456789;

    // Set our navigation extras object
    // that contains our global query params and fragment
    const navigationExtras: NavigationExtras = {
      queryParams: {failedLoggin: true},
      preserveFragment: false,
    };

    // Navigate to the login page with extras
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }
}
