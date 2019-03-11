import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {combineLatest, Observable, of as observableOf, throwError} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';

import {environment} from '../../../environments/environment';
import * as fromConstantes from '../helper-objects/constantes';
import {FuncaoDoUsuario, Funcoes, PermissaoDoUsuario} from '../helper-objects/funcoes-sistema';
import {ObjectReference, UsuarioEFuncaoDTO} from '../transport-objects';

export interface DadosDoUsuarioLogado {
  usuarioRef: ObjectReference;
  permissoesDoUsuario: PermissaoDoUsuario[];
  funcoesDoUsuario: FuncaoDoUsuario[];
  appIDs: string[];
}

@Injectable({
  providedIn: 'root',
})
export class DadosDoUsuarioLogadoService {
  constructor(private _http: HttpClient) {}

  /**
   * Obtém um objeto DadosDoUsuarioLogado completamente preenchido
   *
   * @returns {Observable<DadosDoUsuarioLogado>}
   * @memberof DadosDoUsuarioLogadoService
   */
  obtemDadosDoUsuarioLogado(): Observable<DadosDoUsuarioLogado> {
    return this._obtemEmailEPermissoesDoUsuarioLogado().pipe(
        concatMap((dados: DadosDoUsuarioLogado) => {
          if (!!dados) {
            return combineLatest(
                       observableOf(dados),
                       this._findFuncoesDoUsuarioLogado(dados.usuarioRef.code)
                           .pipe(
                               catchError(
                                   () => throwError(
                                       'Não foi possível obter as permissões do usuário logado')),
                               ),
                       )
                .pipe(
                    map(([dadosDoUsuarioLogado, funcoesDoUsuario]) => ({
                          ...dadosDoUsuarioLogado,
                          funcoesDoUsuario,
                        })),
                );
          } else {
            return throwError(
                'Não foi possível obter os dados do usuário logado');
          }
        }),
    );
  }

  /**
   * Obtém o nome, e-mail e permissões do usuário logado
   *
   * @returns {Observable<DadosDoUsuarioLogado>}
   * @memberof DadosDoUsuarioLogadoService
   */
  private _obtemEmailEPermissoesDoUsuarioLogado():
      Observable<DadosDoUsuarioLogado> {
    if (!environment.production) {
      // provisoriamente este são os valores usados para desenvolvimento
      const permissoesDoUsuario: PermissaoDoUsuario[] = [{
        appID: fromConstantes.APP_ID,
        unidade: 'GOIÂNIA:PERIMETRAL',
        permissoes: `,${fromConstantes.Permissoes.ADMINISTRACAO_SISTEMA},`,
      }];
      const funcoesDoUsuario: FuncaoDoUsuario[] = [];
      const appIDs: string[] = [];

      return observableOf({
        usuarioRef: {
          code: 'juliano.custodio@unialfa.com.br',
          description: 'Juliano Pável Brasil Custódio',
        },
        permissoesDoUsuario,
        funcoesDoUsuario,
        appIDs,
      });
    }

    // ser o ambiente for o de produção, o código abaixo é retornado
    return this._http.get<any>(fromConstantes.URL.baseUserServiceURL)
        .pipe(
            map((dadosDeUsuario: any) => {
              const dadosDoUsuarioLogado: DadosDoUsuarioLogado = {
                usuarioRef: {
                  code: null,
                  description: null,
                  extra: null,
                },
                permissoesDoUsuario: [],
                funcoesDoUsuario: [],
                appIDs: [],
              };

              const authorities: any = dadosDeUsuario['authorities'];
              const appIDs: any = {};
              for (const authorityItem of authorities) {
                if (authorityItem['authority']) {
                  if (authorityItem['authority'].indexOf('completeName=') >
                      -1) {
                    dadosDoUsuarioLogado.usuarioRef.description =
                        authorityItem['authority'].split(
                            'completeName=',
                            )[1];
                  }

                  if (authorityItem['authority'].indexOf('givenName=') > -1) {
                    dadosDoUsuarioLogado.usuarioRef.extra =
                        authorityItem['authority'].split(
                            'giveName=',
                            )[1];
                  }

                  if (authorityItem['authority'].indexOf('mail=') > -1) {
                    dadosDoUsuarioLogado.usuarioRef.code =
                        authorityItem['authority'].split('mail=')[1];
                  }

                  // procura por appIDs de interesse no authorityItem. Isso
                  // servirá para saber se usuário está logado no app correto
                  // (se ele pode acessar este app)
                  this._grabAppID(appIDs, authorityItem);

                  // preenche objeto de permissões em this._imodbService
                  dadosDoUsuarioLogado.permissoesDoUsuario = [
                    ...dadosDoUsuarioLogado.permissoesDoUsuario,
                    ...this._grabUserPermissions(authorityItem),
                  ];
                }
              }

              dadosDoUsuarioLogado.appIDs = Object.keys(appIDs);
            }),
            catchError(
                catchError(() => {
                  window.location.href = fromConstantes.URL.loginURL;
                  return observableOf(null);
                }),
                ),
        );
  }

  /**
   * Obtém as funções do usuário logado
   *
   * @private
   * @param {string} email
   * @returns {Observable<UsuarioEFuncaoDTO[]>}
   * @memberof DadosDoUsuarioLogadoService
   */
  private _findFuncoesDoUsuarioLogado(email: string):
      Observable<FuncaoDoUsuario[]> {
    if (!environment.production) {
      return observableOf([
        {
          appID: fromConstantes.APP_ID,
          unidade: 'GOIÂNIA:PERIMETRAL',
          funcoes: `,${Funcoes.ADMINISTRADOR.funcaoSistema},`,
        },
      ]);
    }

    const url: string = fromConstantes.URL.baseTutoriaServiceURL +
        fromConstantes.URL.usuarioEFuncaoByNameOrEmailPath;
    const params: HttpParams =
        new HttpParams()
            .set(fromConstantes.URL.usuarioEFuncaoByNameOrEmailKey1_any, email)
            .set(fromConstantes.URL.usuarioEFuncaoByNameOrEmailKey2_cidade, '')
            .set(
                fromConstantes.URL.usuarioEFuncaoByNameOrEmailKey3_unidade, '');

    return this._http
        .get<UsuarioEFuncaoDTO[]>(url, {
          params,
        })
        .pipe(
            map(
                (ufs: UsuarioEFuncaoDTO[]):
                    FuncaoDoUsuario[] => {
                      const funcaoPorUnidade:
                          {[key: string]: FuncaoDoUsuario} = {};
                      for (const uf of ufs) {
                        if (!funcaoPorUnidade[uf.unidade]) {
                          funcaoPorUnidade[uf.unidade] = {
                            appID: fromConstantes.APP_ID,
                            unidade: uf.unidade,
                            funcoes: '',
                          };
                        }

                        funcaoPorUnidade[uf.unidade].funcoes +=
                            (funcaoPorUnidade[uf.unidade].funcoes ? ',' : '') +
                            uf.funcao.nomeFuncao + ',';
                      }

                      return Object.keys(funcaoPorUnidade)
                          .map((key: string) => funcaoPorUnidade[key]);
                    },
                ),
            catchError(() => observableOf([])),
        );
  }

  /**
   * Procura pelos aplicativos de reserva, ensalamento e eventos entre as
   *     authorities. Se achar, adiciona no objeto appIDs.
   *
   * @private
   * @param {*} appIDs
   * @param {*} authorityItem
   * @memberof InitService
   */
  private _grabAppID(appIDs: any, authorityItem: any) {
    if (!appIDs) {
      throw new Error('O objeto appIDs não está inicializado');
    }

    if (authorityItem['authority'].indexOf('appID=') > -1 &&
        authorityItem['authority'].indexOf('permissoes=') === -1) {
      // alvo: sp =
      // [appID=,XXXXXXappNome=YYYYYYYYYappUri=:::sgi:::sgiservice:::]
      let sp: string[] = authorityItem['authority'].split('appID=');

      // alvo: sp = [XXXXXX, YYYYYYYYYappUri=:::sgi:::sgiservice:::]
      sp = sp[1].split('appNome=');
      const appID = sp[0];

      if (appID === fromConstantes.APP_ID) {
        appIDs[appID] = true;
      }
    }
  }

  /**
   * Obtém as permissões do usuário de um authority item
   *
   * @private
   * @param {*} authorityItem
   * @returns vetor de PermissaoDoUsuario
   * @memberof InitService
   */
  private _grabUserPermissions(authorityItem: any): PermissaoDoUsuario[] {
    const permissoesDoUsuario: PermissaoDoUsuario[] = [];

    if (authorityItem['authority'].indexOf('appID=') > -1 &&
        authorityItem['authority'].indexOf('permissoes=') > -1) {
      // alvo: sp =
      // [appID=,XXXXXXunidade=YYYYYYYYYpermissoes=|PERM1|PERM2|PERM3|...]
      let sp: string[] = authorityItem['authority'].split('appID=');

      // alvo: sp = [XXXXXX, YYYYYYYYYpermissoes=|PERM1|PERM2|PERM3|...]
      sp = sp[1].split('unidade=');
      const appID = sp[0];

      // alvo: sp = [YYYYYYYYY,|PERM1|PERM2|PERM3|...]
      sp = sp[1].split('permissoes=');
      const unidade = sp[0];

      // alvo: sp = [,sgi,sgiservice,]
      const permissoes =
          sp[1]
              .split('|')
              .filter((p) => !!p)
              .reduce((acc, b) => (acc = acc + (acc ? ',' : '') + b + ','), '');

      const permissoesToAdd: PermissaoDoUsuario = {
        appID,
        unidade,
        permissoes,
      };

      permissoesDoUsuario.push(permissoesToAdd);
    }

    return permissoesDoUsuario;
  }
}
