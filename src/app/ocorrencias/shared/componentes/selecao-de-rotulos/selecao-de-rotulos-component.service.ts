import {Injectable} from '@angular/core';

import {RotuloDoEvento} from '@model-objects';

@Injectable({providedIn: 'root'})
export class SelecaoDeRotulosComponentService {
  /**
   * Adiciona, no início do vetor rotulos, os rotulosEscolhidos, em ordem
   * alfabética.
   *
   * @param {RotuloDoEvento[]} rotulos
   * @param {RotuloDoEvento[]} rotulosEscolhidos
   * @memberof SelecaoDeRotulosComponentService
   */
  _adicionaRotulosSeNaoExistir(rotulos: RotuloDoEvento[],
                               rotulosEscolhidos: RotuloDoEvento[]): void {
    if (!rotulosEscolhidos) {
      return;
    }
    rotulosEscolhidos.forEach((pe: RotuloDoEvento) => {
      const index = rotulos.findIndex((p: RotuloDoEvento) => pe.id === p.id);
      if (index > -1) {
        rotulos.splice(index, 1);
      }
    });

    rotulosEscolhidos.sort(
        (a: RotuloDoEvento, b: RotuloDoEvento) =>
            a.texto.localeCompare(b.texto, 'pt-br', {sensitivity: 'base'}));

    rotulos.splice(0, 0, ...rotulosEscolhidos);
  }
}
