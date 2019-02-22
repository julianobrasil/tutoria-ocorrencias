import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {URL} from '../model/helper-objects/constantes';

@Injectable()
export class TutoriaHttpInterceptorService {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders()
      .set('Content-Type', URL.httpContenTypeJsonValue)
      .set('X-XSRF-TOKEN', document.cookie.split('XSRF-TOKEN=')[1]);
    const authReq = req.clone({
      headers,
      withCredentials: true,
    });

    return next.handle(authReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.headers.get('Content-Type') === 'text/html;charset=UTF-8') {
              window.location.href = URL.logoutAuthOldBrowsers_2nd_Login_GET;
            }
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.url === URL.logoutAuthOldBrowsers_2nd_Login_GET) {
              window.location.href = URL.logoutAuthOldBrowsers_2nd_Login_GET;
            }
          }
        },
      ),
    );
  }
}
