import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';

import {CentroDeCusto} from '../../transport-objects/';

import {URL} from '../../helper-objects/constantes';

@Injectable()
export class CentroDeCustoService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  findCentroDeCustoLikeNomeCurso(cursoNome: string): Observable<CentroDeCusto[]> {
    const params: HttpParams = new HttpParams().set(URL.centroDeCustosPorNomeDoCursoKey, cursoNome);

    return this.http
      .get(URL.baseTutoriaServiceURL + URL.centroDeCustosPorNomeDoCurso, {
        observe: 'response',
        params,
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.ok) {
            return res.body as CentroDeCusto[];
          } else {
            return [];
          }
        }),
        catchError((err) => {
          return of<CentroDeCusto[]>([]);
        }),
      );
  }
}
