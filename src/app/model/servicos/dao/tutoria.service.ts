import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {TUTORIAS_EXISTENTES} from '../../../../data/tutorias';
import {URL} from '../../helper-objects/constantes';
import * as fromDocuments from '../../transport-objects';

@Injectable()
export class TutoriaService {
  constructor(private _http: HttpClient) {}

  obtemuTutoriaPorId(): Observable<fromDocuments.Tutoria> {
    return this._http.get(URL.baseTutoriaServiceURL + URL.tutoriaPath,
                          {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (!res.ok) {
                  const result: fromDocuments.Tutoria = res.body;

                  return result;
                }
              }),
              catchError((err: HttpErrorResponse) => {
                // tslint:disable-next-line:prefer-conditional-expression
                if (err.error instanceof Error) {
                } else {
                }
                return observableOf(null);
              }));
  }

  findAll(email): Observable<fromDocuments.Tutoria[]> {
    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.tutoriaByEmailTutorOuCoordenadorPath +
                              '?email=' + encodeURIComponent(email),
                          {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.Tutoria[];
                } else {
                  return [];
                }
              }),
              catchError(() => observableOf([])));
  }

  saveTutoria(tutoria: fromDocuments.Tutoria):
      Observable<fromDocuments.Tutoria> {
    return this._http.post(URL.baseTutoriaServiceURL + URL.tutoriaSalvarPath,
                           JSON.stringify(tutoria),
                           {
                             observe: 'response',
                           })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body;
                } else {
                  return null;
                }
              }),
              catchError((err) => {
                console.log(err);
                return observableOf(null);
              }));
  }

  removeTutoria(id: string): Observable<boolean> {
    return this._http.delete(URL.baseTutoriaServiceURL +
                                 URL.tutoriaRemoverPath + id,
                             {observe: 'response'})
        .pipe(map(() => true), catchError(() => observableOf(false)));
  }

  findTutoriaByEmailTutorAtivo(): Observable<fromDocuments.Tutoria[]> {
    return observableOf(JSON.parse(JSON.stringify(TUTORIAS_EXISTENTES)));
  }

  findTutoriaByEmailTutorOuCoordenador(email: string, termo?: string,
                                       page?: number, pageSize?: number):
      Observable<fromDocuments.TutoriaPaginada> {
    page--;  // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey1_email, email);

    if (!!termo) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey2_nomeOuEmail,
                          termo);
    }

    if (!!page) {
      params =
          params.set(URL.tutoriaByEmailTutorOuCoordenadorKey3_page, '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorKey3_page,
                          '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.tutoriaByEmailTutorOuCoordenadorPath,
                          {
                            observe: 'response',
                            params,
                          })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.TutoriaPaginada;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findTutoriaByEmailTutorOuCoordenadorOuCurso(email: string, termo?: string,
                                              page?: number, pageSize?: number):
      Observable<fromDocuments.TutoriaPaginada> {
    page--;  // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey1_email,
                        email);

    if (!!termo) {
      params = params.set(
          URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey2_nomeOuEmail, termo);
    }

    if (!!page) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey3_page,
                          '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.tutoriaByEmailTutorOuCoordenadorOuCursoKey4_size,
                          '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.tutoriaByEmailTutorOuCoordenadorOuCursoPath,
                          {
                            observe: 'response',
                            params,
                          })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.TutoriaPaginada;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findTutoriaByPareceristaLogado(): Observable<fromDocuments.Tutoria[]> {
    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.tutoriaByPareceristaLogadoPath,
                          {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.Tutoria[];
                } else {
                  return [];
                }
              }),
              catchError(() => observableOf([])));
  }

  saveDataDeEntrega(dataDeEntrega: fromDocuments.DataDeEntrega):
      Observable<fromDocuments.DataDeEntrega> {
    return this._http.post(URL.baseTutoriaServiceURL +
                               URL.dataDeEntregaSalvarPath,
                           JSON.stringify(dataDeEntrega), {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.status === 201 || res.ok) {
                  return res.body as fromDocuments.DataDeEntrega;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findDataDeEntregaBySemestreDeTrabalho(dataDeEntrega:
                                            fromDocuments.DataDeEntrega):
      Observable<fromDocuments.DataDeEntrega[]> {
    return this._http.post(URL.baseTutoriaServiceURL +
                               URL.dataDeEntregaBySemestreDeTrabalhoPOSTPath,
                           JSON.stringify(dataDeEntrega), {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.DataDeEntrega[];
                } else {
                  return [];
                }
              }),
              catchError(() => observableOf([])));
  }

  removeDataDeEntrega(id: string): Observable<boolean> {
    return this._http.delete(URL.baseTutoriaServiceURL +
                                 URL.dataDeEntregaRemoverPath + id,
                             {
                               observe: 'response',
                             })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return true;
                } else {
                  return false;
                }
              }),
              catchError(() => observableOf(false)));
  }

  saveValorTutoria(valorTutoria: fromDocuments.ValorTutoria):
      Observable<fromDocuments.ValorTutoria> {
    return this._http.post(
                         URL.baseTutoriaServiceURL + URL.valorTutoriaSalvaPath,
                         JSON.stringify(valorTutoria),
                         {
                           observe: 'response',
                         })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.status === 201 || res.ok) {
                  return res.body as fromDocuments.ValorTutoria;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findValorTutoriaBySemestreDeTrabalho(semestreDeTrabalho:
                                           fromDocuments.SemestreDeTrabalho):
      Observable<fromDocuments.ValorTutoria[]> {
    return this._http.post(URL.baseTutoriaServiceURL +
                               URL.valorTutoriaBySemestreDeTrabalhoPOSTPath,
                           JSON.stringify(semestreDeTrabalho),
                           {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body[0] as fromDocuments.ValorTutoria[];
                } else {
                  return [];
                }
              }),
              catchError(() => observableOf([])));
  }

  findEventoByTutorTipoSubtipoCursoNomeResolvido(
      term: string, isResolvido: boolean, page?: number,
      pageSize?: number): Observable<fromDocuments.EventoPaginado> {
    page--;  // a paginação do spring boot começa em 0

    if (page === undefined && pageSize !== undefined) {
      page = 0;
    } else if (page !== undefined && pageSize === undefined) {
      pageSize = 10;
    }

    let params: HttpParams = new HttpParams();

    params =
        params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey1_any, term);

    params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey2_resovido,
                        isResolvido === undefined ? '' : '' + isResolvido);

    if (!!page) {
      params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey3_page,
                          '' + page);
    }

    if (!!pageSize) {
      params = params.set(URL.eventoByTutorTipoSubtipoCursoResolvidoKey4_size,
                          '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.eventoByTutorTipoSubtipoCursoResolvidoPath,
                          {
                            observe: 'response',
                            params,
                          })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.EventoPaginado;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findEventosByPareceristaLogado(page?: number, pageSize?: number):
      Observable<fromDocuments.EventoPaginado> {
    page--;  // a paginação do spring boot começa em 0

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
      params =
          params.set(URL.eventoByPareceristaLogadoKey2_size, '' + pageSize);
    }

    params = params.set('sort', 'lasModifiedDate,desc');

    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.eventoByPareceristaLogadoPath,
                          {
                            observe: 'response',
                            params,
                          })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.EventoPaginado;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  findEventoByEmailTutorAtivo(email: string, page?: number, pageSize?: number):
      Observable<fromDocuments.EventoPaginado> {
    page--;  // a paginação do spring boot começa em 0

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

    return this._http.get(URL.baseTutoriaServiceURL +
                              URL.eventoByEmailTutorAtivoPath,
                          {
                            observe: 'response',
                            params,
                          })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.EventoPaginado;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  saveEvento(evento: fromDocuments.Evento): Observable<fromDocuments.Evento> {
    return this._http.post(URL.baseTutoriaServiceURL + URL.eventoSalvarPath,
                           JSON.stringify(evento),
                           {
                             observe: 'response',
                           })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.Evento;
                } else {
                  return null;
                }
              }),
              catchError((err) => {
                console.log(err);
                return observableOf(null);
              }));
  }

  cutuca(cutucada: fromDocuments.Cutucada): Observable<fromDocuments.Evento> {
    return this._http.post(URL.baseTutoriaServiceURL + URL.eventoCutucaPath,
                           JSON.stringify(cutucada),
                           {
                             observe: 'response',
                           })
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.Evento;
                } else {
                  return null;
                }
              }),
              catchError(() => observableOf(null)));
  }

  solicitaDetalhes(solicitacao: fromDocuments.Solicitacao):
      Observable<fromDocuments.Evento> {
    return this._http.post(URL.baseTutoriaServiceURL +
                               URL.eventoSolicitacaoDetalhesPath,
                           JSON.stringify(solicitacao), {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as fromDocuments.Evento;
                } else {
                  return null;
                }
              }),
              catchError((err) => {
                console.log(err);
                return observableOf(null);
              }));
  }
}
