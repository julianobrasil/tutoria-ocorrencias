import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {forkJoin, Observable, of as observableOf} from 'rxjs';
import {catchError, map, retry, switchMap, tap} from 'rxjs/operators';

import {ImodbService} from './imodb.service';

import {
  Config,
  DadosApp,
  DataDeEntrega,
  Funcao,
  Permissao,
  SemestreDeTrabalho,
  SubTipoEvento,
  TipoEvento,
  Tutoria,
  Unidade,
  Usuario,
  UsuarioAD,
  UsuarioEFuncaoDTO,
  ValorTutoria,
} from '../transport-objects/to';

import {APP_ID, Permissoes, URL} from '../helper-objects/constantes';
import {UserData} from './classes/user-data';

@Injectable()
export class InitService {
  constructor(private _http: HttpClient, private _imodb: ImodbService) {}

  getUserAuthorities(): Observable<UserData | null> {
    return this._http
      .get<any>(URL.baseUserServiceURL + URL.usuarioLogadoPath)
      .pipe(
        map((dadosDeUsuario) => {
          const userData: UserData = new UserData();

          const authorities: any = dadosDeUsuario['authorities'];
          this._imodb.apps = [];
          for (const authorityItem of authorities) {
            if (authorityItem['authority']) {
              if (authorityItem['authority'].indexOf('completeName=') > -1) {
                userData.nomeUsuario = authorityItem['authority'].split('completeName=')[1];
              }

              if (authorityItem['authority'].indexOf('givenName=') > -1) {
                userData.apelido = authorityItem['authority'].split('giveName=')[1];
              }

              if (authorityItem['authority'].indexOf('mail=') > -1) {
                userData.email = authorityItem['authority'].split('mail=')[1];
              }

              if (
                authorityItem['authority'].indexOf('appID=') > -1 &&
                authorityItem['authority'].indexOf('permissoes=') === -1
              ) {
                const app: DadosApp = new DadosApp();

                // alvo: sp = [appID=,XXXXXXappNome=YYYYYYYYYappUri=:::sgi:::sgiservice:::]
                let sp: string[] = authorityItem['authority'].split('appID=');

                // alvo: sp = [XXXXXX, YYYYYYYYYappUri=:::sgi:::sgiservice:::]
                sp = sp[1].split('appNome=');
                app.appID = sp[0];

                // alvo: sp = [YYYYYYYYY,:::sgi:::sgiservice:::]
                sp = sp[1].split('appUri=');
                app.nome = sp[0];
                app.UriTodas = sp[1];

                // alvo: sp = [,sgi,sgiservice,]
                sp = sp[1].split(':::');
                app.UriPrincipal = sp[1];

                this._imodb.apps.push(app);

                if (app.appID === APP_ID) {
                  userData.isLoggedIn = true;
                }
              }
            }
          }

          return userData;
        }),
      )
      .pipe(
        catchError((e) => {
          console.log('uaaaaaiiiiiii');
          window.location.href = URL.loginURL;
          return observableOf(null);
        }),
      );
  }

  getUserPermissions(): Observable<string | null> {
    return this._http
      .get<any>(URL.baseTutoriaServiceURL + URL.permissoesUsuarioAutenticadoPath)
      .pipe(
        map((res) => {
          const userPermissionsList = res.reduce((a, b) => a + (a !== '' ? ',' : '') + b, '');
          return userPermissionsList;
        }),
      )
      .pipe(
        catchError((e) => {
          window.location.href = URL.loginURL;
          return observableOf(null);
        }),
      );
  }

  obtemDataEHora() {
    return setInterval(() => this._obtemDataEHoraSubcriber(), 120000 + Math.random() * 120000);
  }

  private _obtemDataEHoraLogic(): Observable<any> {
    return this._http.get<any>(URL.baseTutoriaServiceURL + URL.dataEHoraServicePath).pipe(
      retry(20),
      catchError((err) => observableOf(null)),
    );
  }

  private _obtemDataEHoraSubcriber() {
    this._obtemDataEHoraLogic().subscribe((obj: any) => {
      if (obj) {
        const hojeServidorNTP: Date = new Date(obj.dataAtual);
        this._imodb.diffHoraLocalServidorMilliSeconds =
          new Date().getTime() - hojeServidorNTP.getTime();
      }
    });
  }

  obtemDemaisDadosDaSessao(userData: UserData, userPermissionsList: string): Observable<any> {
    // obtendo data e hora
    console.log('loading data e hora');
    const dataEHoraObservable = this._obtemDataEHoraLogic().pipe(
      map((obj) => {
        const hojeServidorNTP = new Date(obj.dataAtual);
        this._imodb.diffHoraLocalServidorMilliSeconds =
          new Date().getTime() - hojeServidorNTP.getTime();
        console.log('data e hora loaded');
      }),
    );

    console.log('verifica sessão...');
    const dadosDeUsuarioLogadoObservable = this._verificaSeASessaoEDoUsuarioCorrente(
      userData.email,
    );

    // obtendo tipos de eventos existentes
    console.log('loading tipos de eventos...');
    const tipoEventoObservable = this._obtemTiposDeEventosDisponiveis();

    // obtendo configurações existentes
    console.log('loading existing configurations...');
    const configObservable = this._obtemConfiguracoesExistentes();

    if (
      userPermissionsList.indexOf(Permissoes.ADMINISTRACAO_SISTEMA) > -1 ||
      userPermissionsList.indexOf(Permissoes.CADASTRO_USUARIO_CONSULTAR) > -1 ||
      userPermissionsList.indexOf(Permissoes.CADASTRO_TUTORIA_ALTERAR) > -1
    ) {
      // obtendo unidades
      console.log('loading unidades...');
      const unidadeObservable = this._obtemUnidades();

      // obtendo usuários
      console.log('loading users...');
      const usuariosObservable = this._obtemUsuarios();

      // obtendo permissões disponíveis
      console.log('loading available permissions...');
      const permissoesObservable = this._obtemPermissoesDisponiveis();

      // obtendo funções disponíveis
      console.log('loading available functions...');
      const funcoesObservable = this._obtemFuncoesDisponiveis();

      forkJoin(unidadeObservable, usuariosObservable, permissoesObservable, funcoesObservable)
        .pipe(retry(1))
        .subscribe();
    }

    return forkJoin(
      dadosDeUsuarioLogadoObservable,
      configObservable,
      tipoEventoObservable,
      dataEHoraObservable,
    ).pipe(retry(1));
  }

  private _obtemUnidades(): Observable<Unidade[] | null> {
    return this._http.get<Unidade[]>(URL.baseTutoriaServiceURL + URL.unidadePath).pipe(
      tap((unidades: Unidade[]) => {
        console.log('unidades loaded');
        this._imodb.unidades = unidades;
      }),
      catchError((err) => {
        console.log('Error loading unidades');
        this._imodb.unidades = [];
        return observableOf(null);
      }),
    );
  }

  private _obtemUsuarios(): Observable<UsuarioAD[] | null> {
    return this._http.get<UsuarioAD[]>(URL.baseUserServiceURL + URL.usuarioLdapTodosPath).pipe(
      tap((usuarios: UsuarioAD[]) => {
        console.log('usuers loaded');
        this._imodb.usuarios = usuarios;
      }),
      catchError((e) => {
        console.log('error in users loading');
        this._imodb.usuarios = [];
        return observableOf(null);
      }),
    );
  }

  private _obtemPermissoesDisponiveis(): Observable<Permissao[] | null> {
    return this._http.get<Permissao[]>(URL.baseTutoriaServiceURL + URL.permissoesTodasPath).pipe(
      tap((permissoes: Permissao[]) => {
        console.log('available permissions loaded');
        this._imodb.permissoes = permissoes;
        this._imodb.permissoes.sort(
          (a: Permissao, b: Permissao) =>
            a.descricao.toUpperCase() === b.descricao.toUpperCase()
              ? 0
              : a.descricao.toUpperCase() < b.descricao.toUpperCase()
                ? -1
                : 1,
        );
      }),
      catchError((e) => {
        console.log('error loading available permissions');
        this._imodb.permissoes = [];
        return observableOf(null);
      }),
    );
  }

  private _obtemFuncoesDisponiveis(): Observable<Funcao[] | null> {
    return this._http.get<Funcao[]>(URL.baseTutoriaServiceURL + URL.funcoesTodasPath).pipe(
      tap((funcoes: Funcao[]) => {
        console.log('available funcions loaded');
        this._imodb.funcoes = funcoes;
        this._imodb.funcoes.sort(
          (a: Funcao, b: Funcao) =>
            a.nomeAmigavelFuncao.toUpperCase() === b.nomeAmigavelFuncao.toUpperCase()
              ? 0
              : a.nomeAmigavelFuncao.toUpperCase() < b.nomeAmigavelFuncao.toUpperCase()
                ? -1
                : 1,
        );
      }),
      catchError((err) => {
        console.log('error loading available functions');
        this._imodb.funcoes = [];
        return observableOf(null);
      }),
    );
  }

  obtemFuncoesDousuario(userData: UserData): Observable<string> {
    const params: HttpParams = new HttpParams()
      .set(URL.usuarioEFuncaoByNameOrEmailKey1_any, userData.email)
      .set(URL.usuarioEFuncaoByNameOrEmailKey2_cidade, '')
      .set(URL.usuarioEFuncaoByNameOrEmailKey3_unidade, '');

    return this._http
      .get<UsuarioEFuncaoDTO[]>(URL.baseTutoriaServiceURL + URL.usuarioEFuncaoByNameOrEmailPath, {
        params,
      })
      .pipe(
        map((usuariosEFuncoesDto: UsuarioEFuncaoDTO[]) => {
          console.log('user functions loaded');
          return usuariosEFuncoesDto.reduce(
            (a, b: UsuarioEFuncaoDTO) =>
              a +
              (a.indexOf(b.funcao.nomeFuncao) === -1
                ? (a !== '' ? ',' : '') + b.funcao.nomeFuncao
                : ''),
            '',
          );
        }),
        catchError((err) => {
          console.log('error loading user functions');
          return observableOf('');
        }),
      );
  }

  private _obtemTiposDeEventosDisponiveis(): Observable<TipoEvento[] | null> {
    return this._http.get<TipoEvento[]>(URL.baseTutoriaServiceURL + URL.tipoEventoTodosPath).pipe(
      tap((tipoEventos: TipoEvento[]) => {
        console.log('tipos de eventos loaded');
        this._imodb.tipos = tipoEventos;
      }),
      catchError((e) => {
        console.log('error loading tipos de eventos');
        this._imodb.tipos = [];
        return observableOf(null);
      }),
    );
  }

  private _obtemConfiguracoesExistentes(): Observable<string | null> {
    return this._http.get<Config>(URL.baseTutoriaServiceURL + URL.configUnicaPath).pipe(
      map((config: Config) => {
        console.log('existing configurations loaded');
        this._imodb.config = config;

        return config;
      }),
      switchMap((config: Config) => {
        // obtendo valor da tutoria
        console.log('loading valor da tutoria...');
        return this._http.post<ValorTutoria[]>(
          URL.baseTutoriaServiceURL + URL.valorTutoriaBySemestreDeTrabalhoPOSTPath,
          JSON.stringify(config.semestreDeTrabalho),
        );
      }),
      map((valoresTutoria: ValorTutoria[]) => {
        console.log('valor da tutoria loaded');
        this._imodb.valoresTutoria = valoresTutoria;
        return valoresTutoria;
      }),
      switchMap(() => {
        const dataDeEntrega = new DataDeEntrega();
        dataDeEntrega.semestreDeTrabalho = this._imodb.config.semestreDeTrabalho;
        dataDeEntrega.unidade = '';
        return this._http.post<DataDeEntrega[]>(
          URL.baseTutoriaServiceURL + URL.dataDeEntregaBySemestreDeTrabalhoPOSTPath,
          JSON.stringify(dataDeEntrega),
        );
      }),
      map((datasDeEntrega: DataDeEntrega[]) => {
        this._imodb.datasDeEntrega = datasDeEntrega;

        for (const du of this._imodb.datasDeEntrega) {
          for (let d = 0; d < du.datas.length; d++) {
            du.datas[d] = new Date(du.datas[d]);
          }
        }

        return 'ok';
      }),
      catchError((e) => {
        this._imodb.config = null;
        this._imodb.valoresTutoria = [];
        this._imodb.datasDeEntrega = [];
        return observableOf(null);
      }),
    );
  }

  private _verificaSeASessaoEDoUsuarioCorrente(email: string): Observable<any> {
    return this._http.get<any>(URL.baseUserServiceURL + URL.usuarioLogadoPath).pipe(
      map((dadosDeUsuario: any) => {
        const authorities: any = dadosDeUsuario['authorities'];
        this._imodb.apps = [];
        for (const authorityItem of authorities) {
          if (authorityItem['authority']) {
            if (authorityItem['authority'].indexOf('mail=') > -1) {
              if (email !== authorityItem['authority'].split('mail=')[1]) {
                window.location.href = URL.loginURL;
                return null;
              }
            }
          }
        }

        console.log('Sessão verificada');
      }),
      catchError((err) => {
        console.log('Error verifying session');
        return observableOf(null);
      }),
    );
  }
}
