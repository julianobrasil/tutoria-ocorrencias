import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';

import {
  Cutucada,
  DataDeEntrega,
  Evento,
  EventoPaginado,
  SemestreDeTrabalho,
  Solicitacao,
  Tutoria,
  TutoriaPaginada,
  ValorTutoria,
} from '../../transport-objects/to';

import {URL} from '../../helper-objects/constantes';

@Injectable()
export class TutoriaService {
  constructor(private _authService: AuthService, private _http: HttpClient) {}

  obtemuTutoriaPorId(idTutoria): Observable<Tutoria> {
    return this._http.get(URL.baseTutoriaServiceURL + URL.tutoriaPath, {observe: 'response'}).pipe(
      map((res: HttpResponse<any>) => {
        if (!res.ok) {
          return null;
        }

        const result: Tutoria = res.body;

        return result;
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg: string;

        // tslint:disable-next-line:prefer-conditional-expression
        if (err.error instanceof Error) {
          errMsg = `${err.status} - ${err.error.message || ''} ${err.error}`;
        } else {
          errMsg = err.message ? err.message : err.toString();
        }
        return observableOf(null);
      }),
    );
  }

  findAll(email): Observable<Tutoria[]> {
    return this._http
      .get(
        URL.baseTutoriaServiceURL +
          URL.tutoriaByEmailTutorOuCoordenadorPath +
          '?email=' +
          encodeURIComponent(email),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Tutoria[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  saveTutoria(tutoria: Tutoria): Observable<Tutoria> {
    return this._http
      .post(URL.baseTutoriaServiceURL + URL.tutoriaSalvarPath, JSON.stringify(tutoria), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log(err);
          return observableOf(null);
        }),
      );
  }

  removeTutoria(id: string): Observable<boolean> {
    return this._http
      .delete(URL.baseTutoriaServiceURL + URL.tutoriaRemoverPath + id, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          return true;
        }),
        catchError((err) => observableOf(false)),
      );
  }

  findTutoriaByEmailTutorAtivo(email: string): Observable<Tutoria[]> {
    const params: HttpParams = new HttpParams().set(URL.tutoriaByEmailTutorAtivoKey, email);

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.tutoriaByEmailTutorAtivoPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Tutoria[];
          } else {
            return [];
          }
        }),
        catchError((erro) => observableOf([])),
      );
  }

  findTutoriaByEmailTutorOuCoordenador(
    email: string,
    termo?: string,
    page?: number,
    pageSize?: number,
  ): Observable<TutoriaPaginada> {
    page--; // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey1_email, email);

    if (!!termo) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey2_nomeOuEmail, termo);
    }

    if (!!page) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey3_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey3_page, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.tutoriaByEmailTutorOuCoordenadorPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as TutoriaPaginada;
          } else {
            return null;
          }
        }),
        catchError((erro) => observableOf(null)),
      );
  }

  findTutoriaByEmailTutorOuCoordenadorOuCurso(
    email: string,
    termo?: string,
    page?: number,
    pageSize?: number,
  ): Observable<TutoriaPaginada> {
    page--; // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey1_email, email);

    if (!!termo) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey2_nomeOuEmail, termo);
    }

    if (!!page) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey3_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey4_size, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.tutoriaByEmailTutorOuCoordenadorOuCursoPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as TutoriaPaginada;
          } else {
            return null;
          }
        }),
        catchError((erro) => observableOf(null)),
      );
  }

  findTutoriaByPareceristaLogado(): Observable<Tutoria[]> {
    return this._http
      .get(URL.baseTutoriaServiceURL + URL.tutoriaByPareceristaLogadoPath, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Tutoria[];
          } else {
            return [];
          }
        }),
        catchError((erro) => observableOf([])),
      );
  }

  saveDataDeEntrega(dataDeEntrega: DataDeEntrega): Observable<DataDeEntrega> {
    return this._http
      .post(
        URL.baseTutoriaServiceURL + URL.dataDeEntregaSalvarPath,
        JSON.stringify(dataDeEntrega),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 201 || res.ok) {
            return res.body as DataDeEntrega;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  findDataDeEntregaBySemestreDeTrabalho(dataDeEntrega: DataDeEntrega): Observable<DataDeEntrega[]> {
    return this._http
      .post(
        URL.baseTutoriaServiceURL + URL.dataDeEntregaBySemestreDeTrabalhoPOSTPath,
        JSON.stringify(dataDeEntrega),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as DataDeEntrega[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  removeDataDeEntrega(id: string): Observable<boolean> {
    return this._http
      .delete(URL.baseTutoriaServiceURL + URL.dataDeEntregaRemoverPath + id, {
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

  saveValorTutoria(valorTutoria: ValorTutoria): Observable<ValorTutoria> {
    return this._http
      .post(URL.baseTutoriaServiceURL + URL.valorTutoriaSalvaPath, JSON.stringify(valorTutoria), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 201 || res.ok) {
            return res.body as ValorTutoria;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  findValorTutoriaBySemestreDeTrabalho(
    semestreDeTrabalho: SemestreDeTrabalho,
  ): Observable<ValorTutoria[]> {
    return this._http
      .post(
        URL.baseTutoriaServiceURL + URL.valorTutoriaBySemestreDeTrabalhoPOSTPath,
        JSON.stringify(semestreDeTrabalho),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body[0] as ValorTutoria[];
          } else {
            return [];
          }
        }),
        catchError((err) => observableOf([])),
      );
  }

  findEventoByTutorTipoSubtipoCursoNomeResolvido(
    term: string,
    isResolvido: boolean,
    page?: number,
    pageSize?: number,
  ): Observable<EventoPaginado> {
    page--; // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey1_any, term);

    params = params.set(
      URL.eventoByTutorTipoSubtipoCursoResolvidoKey2_resovido,
      isResolvido === undefined ? '' : '' + isResolvido,
    );

    if (!!page) {
      params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey3_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey4_size, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.eventoByTutorTipoSubtipoCursoResolvidoPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as EventoPaginado;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  findEventosByPareceristaLogado(page?: number, pageSize?: number): Observable<EventoPaginado> {
    page--; // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    if (!!page) {
      params = params.set(URL.eventoByPareceristaLogadoKey1_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.eventoByPareceristaLogadoKey2_size, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.eventoByPareceristaLogadoPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as EventoPaginado;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  findEventoByEmailTutorAtivo(
    email: string,
    page?: number,
    pageSize?: number,
  ): Observable<EventoPaginado> {
    page--; // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.eventoByEmailTutorAtivoKey1_email, email);

    if (!!page) {
      params = params.set(URL.eventoByEmailTutorAtivoKey2_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.eventoByEmailTutorAtivoKey3_size, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http
      .get(URL.baseTutoriaServiceURL + URL.eventoByEmailTutorAtivoPath, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as EventoPaginado;
          } else {
            return null;
          }
        }),
        catchError((erro) => observableOf(null)),
      );
  }

  saveEvento(evento: Evento): Observable<Evento> {
    return this._http
      .post(URL.baseTutoriaServiceURL + URL.eventoSalvarPath, JSON.stringify(evento), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Evento;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log(err);
          return observableOf(null);
        }),
      );
  }

  removeEvento(id: string): Observable<boolean> {
    return this._http
      .delete(URL.baseTutoriaServiceURL + URL.eventoRemoverPath + id, {observe: 'response'})
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

  cutuca(cutucada: Cutucada): Observable<Evento> {
    return this._http
      .post(URL.baseTutoriaServiceURL + URL.eventoCutucaPath, JSON.stringify(cutucada), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Evento;
          } else {
            return null;
          }
        }),
        catchError((err) => observableOf(null)),
      );
  }

  solicitaDetalhes(solicitacao: Solicitacao): Observable<Evento> {
    return this._http
      .post(
        URL.baseTutoriaServiceURL + URL.eventoSolicitacaoDetalhesPath,
        JSON.stringify(solicitacao),
        {observe: 'response'},
      )
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as Evento;
          } else {
            return null;
          }
        }),
        catchError((err) => {
          console.log(err);
          return observableOf(null);
        }),
      );
  }
}
