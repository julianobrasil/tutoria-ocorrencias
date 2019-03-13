import {InjectionToken} from '@angular/core';

import {Observable} from 'rxjs';

import {ObjectReference} from '../../../../model/transport-objects';

/** Token para injetar o serviço de obtenção de pessoas */
export const PESSOAS_SERVICE_ADAPTER: InjectionToken<PessoaServiceAdapter> =
    new InjectionToken<PessoaServiceAdapter>('PESSOAS_SERVICE_ADAPTER');

export interface PessoaServiceAdapter {
  /**
   * Este método deve devolver um array de ObjectReference, contendo informações
   * de pessoas (email, nome e, opcionalmente, algum extra). Como bases de
   * usuários costumam ser grandes, o método deve ser paginado.
   *
   * No ObjectReference:
   *     - code: O email da pessoa
   *     - description: nome da pessoa
   *
   * @param {number} pagina
   * @param {number} tamanhoDaPagina
   * @param {string} valor
   * @returns {Observable<ObjectReference[]>}
   * @memberof PessoasServiceAdapter
   */
  obtemPessoas(pagina: number, tamanhoDaPagina: number,
               valor: string): Observable<ObjectReference[]>;
}
