import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';

import {concat, forkJoin, Observable, of as observableOf, Subscription} from 'rxjs';
import {catchError, concatMap, map, mergeMap, retry, tap} from 'rxjs/operators';

import {InitService} from '../model/servicos/init.service';

import {APP_ID, Permissoes, URL} from '../model/helper-objects/constantes';

import {LoginData} from '../model/helper-objects/login-data';
import {UserData} from '../model/servicos/classes/user-data';
import {TutoriaService} from '../model/servicos/dao/tutoria.service';
import {UsuarioService} from '../model/servicos/dao/usuario.service';
import {ImodbService} from '../model/servicos/imodb.service';

import {
  DadosApp,
  DataDeEntrega,
  Funcao,
  Permissao,
  Tutoria,
  UsuarioAD,
  UsuarioEFuncaoDTO,
  UsuarioFuncao,
  ValidadeSenha,
  ValorTutoria,
} from '../model/transport-objects/to';

@Injectable()
export class AuthService {
  public email = '';
  public nomeUsuario = '';
  public apelido = '';
  public sobrenome = '';
  public isSenhaDeveSerTrocada: boolean;
  public userPermissionsList = '';
  public userFunctionsList = '';
  public isLoggedIn: boolean;
  public token = '';
  public atualizacaoDeDadosPeriodica: any;
  public interrompeObtencaoPeriodicaDeHoras: any;
  public redirectUrl: string;

  constructor(
    private http: HttpClient,
    public router: Router,
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

            this._verificaPermissoes(permissoes, userData);
          }),
        );
      }),
    );
  }

  private _verificaPermissoes(permissoes: string, userData: UserData) {
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
      (resAuth) => {
        this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
          (resGateway) => {
            window.location.href = URL.loginURL;
          },
          (erro) => {
            window.location.href = URL.loginURL;
          },
        );
      },
      (erro) => {
        this.http
          .get(URL.logoutAuthOldBrowsers_1st_LoginLogout_GET, {responseType: 'text'})
          .subscribe(
            (resAuth) => {
              this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
                (resGateway) => {
                  window.location.href = URL.loginURL;
                },
                (erro2) => {
                  window.location.href = URL.loginURL;
                },
              );
            },
            (erro2) => {
              this.http
                .get(URL.logoutAuthOldBrowsers_2nd_Login_GET, {responseType: 'text'})
                .subscribe(
                  (resAuth) => {
                    this.http.post(URL.logoutGatewayURL, '', {responseType: 'text'}).subscribe(
                      (resGateway) => {
                        window.location.href = URL.loginURL;
                      },
                      (erro3) => {
                        window.location.href = URL.loginURL;
                      },
                    );
                  },
                  (erro3) => {
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
}
