import {Injectable} from '@angular/core';

import {Observable, of as observableOf} from 'rxjs';

import {ROTULOS_EXISTENTES} from '../../../../data/rotulos-dos-eventos';

import * as fromDocuments from '../../transport-objects';

@Injectable({providedIn: 'root'})
export class RotuloRestService {
  /**
   * Obtém os rótulos por parte do nome
   *
   * @param {string} valor
   * @returns {Observable<fromDocuments.RotuloDoEvento[]>}
   * @memberof RotuloRestService
   */
  obtemRotulosPorParteDoNome(valor: string):
      Observable<fromDocuments.RotuloDoEvento[]> {
    if (!valor) {
      return observableOf(JSON.parse(JSON.stringify(ROTULOS_EXISTENTES)));
    }
    valor = valor.toUpperCase();
    const rotulos = ROTULOS_EXISTENTES.filter(
        (r: fromDocuments.RotuloDoEvento) =>
            r.texto.toUpperCase().includes(valor));

    return observableOf(JSON.parse(JSON.stringify(rotulos)));
  }
}
