import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {AuthService} from '../../auth/auth.service';
import {URL} from '../helper-objects/constantes';
import {RelatorioConsultaTutoriasWrapperDTO, SemestreDeTrabalho} from '../transport-objects/';

@Injectable()
export class RelatoriosService {
  constructor(private authService: AuthService, private _http: HttpClient) {}

  obtemRelatorioAtividadesTutorias(
      relatorioConsulta: RelatorioConsultaTutoriasWrapperDTO,
      ): Observable<any> {
    return Observable.create((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
          'POST',
          URL.baseTutoriaServiceURL + URL.relatorioAtividadesTutoriasPOSTPath,
          true);
      // xhr.setRequestHeader(url.authorizationHeaderKey,
      // this.authService.token);
      xhr.setRequestHeader(URL.httpContenTypeKey, URL.httpContenTypeJsonValue);
      xhr.setRequestHeader(
          'X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
      xhr.withCredentials = true;
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], {type: contentType});
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send(JSON.stringify(relatorioConsulta));
    });
  }

  obtemRelatorioTodasTutorias(): Observable<any> {
    return Observable.create((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
          'GET', URL.baseTutoriaServiceURL + URL.relatorioTutoriasTodosPath,
          true);
      // xhr.setRequestHeader(url.authorizationHeaderKey,
      // this.authService.token);
      xhr.setRequestHeader(
          'X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
      xhr.withCredentials = true;
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], {type: contentType});
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send();
    });
  }

  obtemRelatorioEspecificoTutorias(
      relatorioConsulta: RelatorioConsultaTutoriasWrapperDTO,
      ): Observable<any> {
    return Observable.create((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
          'POST',
          URL.baseTutoriaServiceURL + URL.relatorioTutoriasEspecificoPOSTPath,
          true);
      // xhr.setRequestHeader(url.authorizationHeaderKey,
      // this.authService.token);
      xhr.setRequestHeader(URL.httpContenTypeKey, URL.httpContenTypeJsonValue);
      xhr.setRequestHeader(
          'X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
      xhr.withCredentials = true;
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], {type: contentType});
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send(JSON.stringify(relatorioConsulta));
    });
  }

  obtemRelatorioTodosRepresentantes(notificaEleicaoRepresentantes: boolean):
      Observable<any> {
    return Observable.create((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
          'GET',
          URL.baseTutoriaServiceURL + URL.relatorioRepresentantesTodosPath +
              '?' +
              URL.relatorioRepresentantesTodosKey1_notificaEleicaoRepresentantes +
              '=' + notificaEleicaoRepresentantes,
          true,
      );
      // xhr.setRequestHeader(url.authorizationHeaderKey,
      // this.authService.token);
      xhr.setRequestHeader(
          'X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
      xhr.withCredentials = true;
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], {type: contentType});
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send();
    });
  }

  obtemRelatorioEspecificoRepresentantes(
      relatorioConsulta: RelatorioConsultaTutoriasWrapperDTO,
      ): Observable<any> {
    return Observable.create((observer) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
          'POST',
          URL.baseTutoriaServiceURL +
              URL.relatorioRepresentantesEspecificoPOSTPath,
          true,
      );
      // xhr.setRequestHeader(url.authorizationHeaderKey,
      // this.authService.token);
      xhr.setRequestHeader(URL.httpContenTypeKey, URL.httpContenTypeJsonValue);
      xhr.setRequestHeader(
          'X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
      xhr.withCredentials = true;
      xhr.responseType = 'blob';

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            const contentType =
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const blob = new Blob([xhr.response], {type: contentType});
            observer.next(blob);
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.send(JSON.stringify(relatorioConsulta));
    });
  }

  obtemRelatorioDetalhadoPorSemestre(semestreDeTrabalho: SemestreDeTrabalho):
      Observable<any> {
    const requestUrl = URL.baseTutoriaServiceURL +
        URL.relatorioAtividadesDetalhadoPorSemestrePOSTPath;

    return this._http
        .post(requestUrl, semestreDeTrabalho, {
          responseType: 'blob',
          withCredentials: true,
        })
        .pipe(
            map((res) => ({file: res})),
            catchError((res) => {
              return observableOf({file: null});
            }),
        );
  }
}
