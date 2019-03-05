import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {UNIDADES_EXISTENTES} from '../../../../data/unidades';
import {AuthService} from '../../../auth/auth.service';
import {URL} from '../../helper-objects/constantes';
import {Unidade} from '../../transport-objects';

@Injectable({providedIn: 'root'})
export class UnidadeRestService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  /** busca as datas de entrega do semestre corrente */
  findUnidades(): Observable<Unidade[]> {
    return of<Unidade[]>(JSON.parse(JSON.stringify(UNIDADES_EXISTENTES)));
  }
}
