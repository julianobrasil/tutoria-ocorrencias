import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Observable, of as observableOf} from 'rxjs';
import {concatMap, map} from 'rxjs/operators';

import {ImodbService} from '../model/servicos/imodb.service';
import {InitService} from '../model/servicos/init.service';

import {Permissoes, URL} from '../model/helper-objects/constantes';

import {Funcoes} from '../model/helper-objects/funcoes-sistema';
import {UserData} from '../model/servicos/classes/user-data';

import {environment} from '../../environments/environment';

@Injectable()
export class AuthService {
  email = 'juliano.custodio@unialfa.com.br';
  nomeUsuario = 'Juliano Pável';
  apelido = 'Juliano';
  sobrenome = 'Pável';
  isSenhaDeveSerTrocada: boolean;
  userPermissionsList = environment.production ? '' : `,${Permissoes.ADMINISTRACAO_SISTEMA},`;
  userFunctionsList = '';
  isLoggedIn: boolean;
  token = '';
  atualizacaoDeDadosPeriodica: any;
  interrompeObtencaoPeriodicaDeHoras: any;
  redirectUrl: string;

  constructor(
    private http: HttpClient,
    private imodb: ImodbService,
    private _initService: InitService,
  ) {}

  login(): Observable<any> {
    this.token = '';
    this.isLoggedIn = false;

    console.log('loading user basics');
    return this._initService.getUserAuthorities().pipe(
      map((userData: UserData | null) => {
        console.log('user basics loaded');
        if (!userData || !userData.isLoggedIn) {
          this.isLoggedIn = false;
          this.logout();
          return null;
        }

        this.isLoggedIn = userData.isLoggedIn;
        this.nomeUsuario = userData.nomeUsuario;
        this.apelido = userData.apelido;
        this.email = userData.email;

        console.log('loading user permissions...');
        return userData;
      }),
      concatMap((userData: UserData | null) => {
        if (!userData) {
          return observableOf(null);
        }

        return this._initService.getUserPermissions().pipe(
          map((permissoes: string) => {
            if (!permissoes) {
              this.logout();
              return;
            }

            this.userPermissionsList = permissoes;

            this._verificaPermissoes(userData);
          }),
        );
      }),
    );
  }

  private _verificaPermissoes(userData: UserData) {
    if (
      this.isUserInRoles([
        Permissoes.REGISTRO_TUTORIA_ALTERAR,
        Permissoes.REGISTRO_TUTORIA_CONSULTAR,
        Permissoes.REGISTRO_TUTORIA_VISUALIZAR,
        Permissoes.PARECER_TUTORIA_ALTERAR,
        Permissoes.PARECER_TUTORIA_CONSULTAR,
        Permissoes.PARECER_TUTORIA_VISUALIZAR,
      ])
    ) {
      this.redirectUrl = '/tutoria/atividades';
    } else if (
      this.isUserInRoles([
        Permissoes.RELATORIO_CONSULTAR,
        Permissoes.RELATORIO_ALTERAR,
        Permissoes.RELATORIO_VISUALIZAR,
        Permissoes.RELATORIO_REPRESENTANTES_CONSULTAR,
        Permissoes.RELATORIO_REPRESENTANTES_ALTERAR,
        Permissoes.RELATORIO_REPRESENTANTES_VISUALIZAR,
        Permissoes.RELATORIO_TUTORIAS_ALTERAR,
        Permissoes.RELATORIO_TUTORIAS_CONSULTAR,
        Permissoes.RELATORIO_TUTORIAS_VISUALIZAR,
      ])
    ) {
      this.redirectUrl = '/tutoria/relatorios';
    }

    this._initService.obtemDemaisDadosDaSessao(userData, this.userPermissionsList).subscribe();

    // obtendo funções do usuário
    console.log('loading user functions...');
    this._initService
      .obtemFuncoesDousuario(userData)
      .subscribe((f: string) => (this.userFunctionsList = f));

    this.atualizacaoDeDadosPeriodica = setInterval(() => {
      this._initService.obtemDemaisDadosDaSessao(userData, this.userPermissionsList).subscribe();

      // obtendo funções do usuário
      console.log('loading user functions...');
      this._initService
        .obtemFuncoesDousuario(userData)
        .subscribe((f: string) => (this.userFunctionsList = f));
    }, 600000);
  }

  logout(): void {
    this.isLoggedIn = false;
    this.userPermissionsList = '';

    this.imodb.config = null;
    this.imodb.funcoes = [];
    this.imodb.permissoes = [];
    this.imodb.tipos = [];
    this.imodb.tutorias = [];
    this.imodb.unidades = [];
    this.imodb.usuarios = [];
    this.imodb.datasDeEntrega = null;
    this.imodb.diffHoraLocalServidorMilliSeconds = null;
    clearTimeout(this.interrompeObtencaoPeriodicaDeHoras);
    clearTimeout(this.atualizacaoDeDadosPeriodica);

    this.http.post(URL.logoutAuthURL, '', {responseType: 'text'}).subscribe(
      () => {
        this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
          () => {
            window.location.href = URL.loginURL;
          },
          () => {
            window.location.href = URL.loginURL;
          },
        );
      },
      () => {
        this.http
          .get(URL.logoutAuthOldBrowsers_1st_LoginLogout_GET, {responseType: 'text'})
          .subscribe(
            () => {
              this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
                () => {
                  window.location.href = URL.loginURL;
                },
                () => {
                  window.location.href = URL.loginURL;
                },
              );
            },
            () => {
              this.http
                .get(URL.logoutAuthOldBrowsers_2nd_Login_GET, {responseType: 'text'})
                .subscribe(
                  () => {
                    this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
                      () => {
                        window.location.href = URL.loginURL;
                      },
                      () => {
                        window.location.href = URL.loginURL;
                      },
                    );
                  },
                  () => {
                    window.location.href = URL.loginURL;
                  },
                );
            },
          );
      },
    );

    clearInterval(this.atualizacaoDeDadosPeriodica);
  }

  isUserInRoles(roles: string[]): boolean {
    for (const role of roles) {
      if (this.userPermissionsList.indexOf(role) > -1) {
        return true;
      }
    }

    return false;
  }

  isUserInRole(role: string): boolean {
    return this.userPermissionsList.indexOf(role) > -1;
  }

  /** verifica se o usuário logado é administrador */
  isUsuarioLogadoAdministrador(): boolean {
    return this.isUserInRole(Permissoes.ADMINISTRACAO_SISTEMA);
  }

  /** verifica se usuário logado tem permissão de qualidade */
  isUsuarioLogadoQualidade(): any {
    return this.userFunctionsList.includes(Funcoes.QUALIDADE.funcaoSistema);
  }

  /** verifica se usuário logado tem permissão de diretor */
  isUsuarioLogadoDiretoria(): any {
    return this.userFunctionsList.includes(Funcoes.DIRETOR.funcaoSistema);
  }
}
