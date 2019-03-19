import {InjectionToken} from '@angular/core';

import {Observable} from 'rxjs';

import {RotuloDoEvento} from '@model-objects';

/** Token para injetar o serviço de obtenção de pessoas */
export const ROTULOS_SERVICE_ADAPTER: InjectionToken<RotuloServiceAdapter> = new InjectionToken<
  RotuloServiceAdapter
>('Serviço de rótulos de eventos');

export interface RotuloServiceAdapter {
  /**
   * Este método deve devolver um array de RotuloDoEvento.
   *
   * @param {string} valor
   * @returns {Observable<RotuloDoEvento[]>}
   * @memberof RotulosServiceAdapter
   */
  obtemRotulos(valor: string): Observable<RotuloDoEvento[]>;
}
