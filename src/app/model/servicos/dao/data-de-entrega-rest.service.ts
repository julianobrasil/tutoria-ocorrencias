import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {DATAS_DE_ENTREGA_EXISTENTES} from '../../../../data/datas-de-entrega';
import {AuthService} from '../../../auth/auth.service';
import {URL} from '../../helper-objects/constantes';
import {DataDeEntrega} from '../../transport-objects';

@Injectable({providedIn: 'root'})
export class DataDeEntregaRestService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  /** busca as datas de entrega do semestre corrente */
  findDatasDeEntrega(ano: number, semestre: number):
      Observable<DataDeEntrega[]> {
    return of<DataDeEntrega[]>(
        JSON.parse(JSON.stringify(DATAS_DE_ENTREGA_EXISTENTES)));
  }
}
