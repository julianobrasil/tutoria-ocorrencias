import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';

import {Config} from '../../transport-objects/to';

import {URL} from '../../helper-objects/constantes';

@Injectable()
export class ConfiguracoesService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  save(config: Config): Observable<Config> {
    return this.http
      .post(URL.baseTutoriaServiceURL + URL.configSalvarPath, JSON.stringify(config), {
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 201 || res.status === 200) {
            return res.body;
          } else {
            return null;
          }
        }),
        catchError((err) => of(null)),
      );
  }

  findUnique(): Observable<Config> {
    return this.http
      .get(URL.baseTutoriaServiceURL + URL.configUnicaPath, {observe: 'response'})
      .pipe(
        map((res: HttpResponse<any>) => {
          if (res.status === 200) {
            return res.body as Config;
          } else {
            return null;
          }
        }),
        catchError((err) => of(null)),
      );
  }
}
