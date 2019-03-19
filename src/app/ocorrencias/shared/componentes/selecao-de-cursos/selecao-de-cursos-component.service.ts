import {Injectable} from '@angular/core';

import {ObjectReference} from '@model-objects';

@Injectable({providedIn: 'root'})
export class SelecaoDeCursosComponentService {
  /**
   * Adiciona, no início do vetor cursos, as cursosEscolhidos, no início do
   * vetor e em ordem alfabética.
   *
   * @param {ObjectReference[]} cursos
   * @param {ObjectReference[]} cursosEscolhidos
   * @memberof SelecaoDeCursosComponentService
   */
  _adicionaCursosSeNaoExistir(
    cursos: ObjectReference[],
    cursosEscolhidos: ObjectReference[],
  ): void {
    cursosEscolhidos.forEach((pe: ObjectReference) => {
      const index = cursos.findIndex((p: ObjectReference) => pe.code === p.code);
      if (index > -1) {
        cursos.splice(index, 1);
      }
    });

    cursosEscolhidos.sort((a: ObjectReference, b: ObjectReference) =>
      a.code.localeCompare(b.code, 'pt-br', {sensitivity: 'base'}),
    );

    cursos.splice(0, 0, ...cursosEscolhidos);
  }
}
