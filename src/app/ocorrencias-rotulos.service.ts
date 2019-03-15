import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {RotuloServiceAdapter} from './ocorrencias/public_api';

import {RotuloRestService} from './model/servicos/dao/rotulo-rest.service';

import {RotuloDoEvento} from './model/transport-objects';

@Injectable({providedIn: 'root'})
export class OcorrenciasRotulosAdapterService implements RotuloServiceAdapter {
  constructor(private _rotuloService: RotuloRestService) {}

  /**
   * Obtém Rótulos
   *
   * @param {string} valor
   * @returns {Observable<RotuloDoEvento[]>}
   * @memberof OcorrenciasRotulosAdapterService
   */
  obtemRotulos(valor: string): Observable<RotuloDoEvento[]> {
    return this._rotuloService.obtemRotulosPorParteDoNome(valor);
  }
}
