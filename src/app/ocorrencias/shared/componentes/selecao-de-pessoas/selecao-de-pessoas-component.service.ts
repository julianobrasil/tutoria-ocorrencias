import {Injectable} from '@angular/core';
import {ObjectReference} from '../../../model';

@Injectable({providedIn: 'root'})
export class SelecaoDePessoasComponentService {
  /**
   * Adiciona, no início do vetor pessoas, as pessoasEscolhidas, no início do
   * vetor e em ordem alfabética.
   *
   * @param {ObjectReference[]} pessoas
   * @param {ObjectReference[]} pessoasEscolhidas
   * @memberof SelecaoDePessoasComponentService
   */
  _adicionaPessoasSeNaoExistir(pessoas: ObjectReference[],
                               pessoasEscolhidas: ObjectReference[]): void {
    pessoasEscolhidas.forEach((pe: ObjectReference) => {
      const index =
          pessoas.findIndex((p: ObjectReference) => pe.code === p.code);
      if (index > -1) {
        pessoas.splice(index, 1);
      }
    });

    pessoasEscolhidas.sort(
        (a: ObjectReference, b: ObjectReference) =>
            a.code.localeCompare(b.code, 'pt-br', {sensitivity: 'base'}));

    pessoas.splice(0, 0, ...pessoasEscolhidas);
  }
}
