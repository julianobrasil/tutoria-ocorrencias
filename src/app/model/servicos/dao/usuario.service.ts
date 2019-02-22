import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';

import {
  Tutoria,
  Usuario,
  UsuarioAD,
  UsuarioEFuncaoDTO,
  UsuarioEPermissaoDTO,
  UsuarioFuncao,
  UsuarioPermissao,
} from '../../transport-objects/to';

import {URL} from '../../helper-objects/constantes';

@Injectable()
export class UsuarioService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  // busca por usuários cadastrados no AD
  findInADByEmail(email: string): Observable<UsuarioAD> {
    const params: HttpParams = new HttpParams().set(
      URL.usuarioLdapByEmailKey,
      encodeURIComponent(email),
    );

    return this.http
      .get(URL.baseUserServiceURL + URL.usuarioLdapByEmailPath, {observe: 'response', params})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioAD;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log('estou aqui no erro');
          return observableOf<UsuarioAD>(null);
        }),
      );
  }

  findInADLikeNameOrEmail(nameOREmail: string): Observable<UsuarioAD[]> {
    const params: HttpParams = new HttpParams().set(
      URL.usuariosLdapByNameOrEmailKey,
      encodeURIComponent(nameOREmail),
    );

    return this.http
      .get(URL.baseUserServiceURL + URL.usuariosLdapByNameOrEmailPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioAD[];
          } else {
            return [];
          }
        }),
        catchError((err) => {
          console.log('estou aqui no erro');
          return [];
        }),
      );
  }

  findLikeNameOrEmail(nameOREmail: string): Observable<Usuario[]> {
    const params: HttpParams = new HttpParams().set(
      URL.usuariosByNameOrEmailKey,
      encodeURIComponent(nameOREmail),
    );

    return this.http
      .get(URL.baseTutoriaServiceURL + URL.usuariosLikeNameOrEmailPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Usuario[];
          } else {
            return [];
          }
        }),
        catchError((err) => {
          console.log('estou aqui no erro');
          return [];
        }),
      );
  }

  // usuário do sistema não é o usuário do AD
  // é do banco sql no auth server
  findByEmailSistema(email: string): Observable<Usuario> {
    const params: HttpParams = new HttpParams().set(
      URL.usuarioByEmailKey,
      encodeURIComponent(email),
    );

    return this.http
      .get(URL.baseTutoriaServiceURL + URL.usuarioByEmailPath, {observe: 'response', params})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Usuario;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log('estou aqui no erro');
          return observableOf<Usuario>(null);
        }),
      );
  }

  // usuário do sistema não é o usuário do AD
  // é do banco sql no auth server
  findUsuarioLogadoSistema(): Observable<Usuario> {
    return this.http
      .get(URL.baseTutoriaServiceURL + URL.usuarioSqlLogadoPath, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Usuario;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log('estou aqui no erro');
          return observableOf<Usuario>(null);
        }),
      );
  }

  saveUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http
      .post(URL.baseTutoriaServiceURL + URL.usuarioSalvarPath, JSON.stringify(usuario), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Usuario;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  saveFuncao(usuarioEFuncaoDTO: UsuarioEFuncaoDTO): Observable<UsuarioEFuncaoDTO[]> {
    return this.http
      .post(
        URL.baseTutoriaServiceURL + URL.usuarioEFuncaoSalvaPath,
        JSON.stringify(usuarioEFuncaoDTO),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioEFuncaoDTO[];
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  savePermissao(usuarioEPermissao: UsuarioPermissao): Observable<UsuarioPermissao[]> {
    return this.http
      .post(
        URL.baseTutoriaServiceURL + URL.usuarioEPermissaoSalvaPath,
        JSON.stringify(usuarioEPermissao),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioPermissao[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  findAllPermissoes(): Observable<any[]> {
    return this.http
      .get(URL.baseTutoriaServiceURL + URL.permissoesTodasPath, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body;
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  findAllFuncoes(): Observable<any[]> {
    return this.http
      .get(URL.baseTutoriaServiceURL + URL.funcoesTodasPath, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 201 || res.ok) {
            return res.body;
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  findFuncaoLikeNameOrEmail(
    nameOrEmail: string,
    cidade?: string,
    unidade?: string,
  ): Observable<UsuarioEFuncaoDTO[]> {
    const params: HttpParams = new HttpParams()
      .set(URL.usuarioEFuncaoByNameOrEmailKey1_any, nameOrEmail)
      .set(URL.usuarioEFuncaoByNameOrEmailKey2_cidade, !!cidade ? cidade : '')
      .set(URL.usuarioEFuncaoByNameOrEmailKey3_unidade, !!unidade ? unidade : '');

    return this.http
      .get(URL.baseTutoriaServiceURL + URL.usuarioEFuncaoByNameOrEmailPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioEFuncaoDTO[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  findPermissaoLikeNameOrEmail(
    nameOrEmail: string,
    cidade?: string,
    unidade?: string,
  ): Observable<UsuarioPermissao[]> {
    const params: HttpParams = new HttpParams()
      .set(URL.usuarioEPermissaoByNameOrEmailKey1_any, nameOrEmail)
      .set(URL.usuarioEPermissaoByNameOrEmailKey2_cidade, !!cidade ? cidade : '')
      .set(URL.usuarioEPermissaoByNameOrEmailKey3_unidade, !!unidade ? unidade : '');

    return this.http
      .get(URL.baseTutoriaServiceURL + URL.usuarioEPermissaoByNameOrEmailPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as UsuarioPermissao[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  removeFuncao(id: string): Observable<boolean> {
    return this.http
      .delete(URL.baseTutoriaServiceURL + URL.usuarioEFuncaoRemoverPath + id, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return true;
          } else {
            return false;
          }
        }),
        catchError((err) => observableOf(false)),
      );
  }

  removePermissao(id: string): Observable<boolean> {
    return this.http
      .delete(URL.baseTutoriaServiceURL + URL.usuarioEPermissaoRemoverPath + id, {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return true;
          } else {
            return false;
          }
        }),
      );
  }
}
