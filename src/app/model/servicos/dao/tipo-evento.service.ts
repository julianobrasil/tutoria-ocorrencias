import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';

import {TipoEvento} from '../../transport-objects/tipo-evento';

import {TIPOS_EVENTOS_DISPONIVEIS} from '../../../../data/tipos_eventos';
import {URL} from '../../helper-objects/constantes';

@Injectable()
export class TipoEventoService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  saveTipoEvento(tipo: TipoEvento): Observable<TipoEvento[]> {
    return this.http.post(URL.baseTutoriaServiceURL + URL.tipoEventoSalvarPath,
                          JSON.stringify(tipo),
                          {
                            observe: 'response',
                          })
        .pipe(map((res: HttpResponse<any>) => {
                // console.log(res);
                if (res.ok) {
                  return res.body as TipoEvento[];
                } else {
                  return null;
                }
              }),
              catchError((err) => observableOf(null)));
  }

  findTipoEventoLikeEmail(email: string, cidade?: string,
                          unidade?: string): Observable<TipoEvento[]> {
    const params: HttpParams =
        new HttpParams()
            .set(URL.tipoEventoByEmailKey1_emailResponsavel, email)
            .set(URL.tipoEventoByEmailKey2_cidade, !!cidade ? cidade : '')
            .set(URL.tipoEventoByEmailKey3_unidade, !!unidade ? unidade : '');

    return this.http.get(URL.baseTutoriaServiceURL + URL.tipoEventoByEmailPath,
                         {observe: 'response', params})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return res.body as TipoEvento[];
                } else {
                  return [];
                }
              }),
              catchError((err) => observableOf([])));
  }

  removeTipoEvento(id: string): Observable<boolean> {
    return this.http.delete(URL.baseTutoriaServiceURL +
                                URL.tipoEventoRemoverPath + id,
                            {observe: 'response'})
        .pipe(map((res: HttpResponse<any>) => {
                if (res.ok) {
                  return true;
                } else {
                  return false;
                }
              }),
              catchError((err) => observableOf(false)));
  }

  /** MÉTODOS ACRESCENTADOS */

  /** Obtém todos os tipos de eventos disponíveis */
  findAllTipoEventos(): Observable<TipoEvento[]> {
    return observableOf(TIPOS_EVENTOS_DISPONIVEIS);
  }
}
