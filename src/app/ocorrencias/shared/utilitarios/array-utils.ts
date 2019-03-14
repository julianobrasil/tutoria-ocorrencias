import {Injectable} from '@angular/core';

import {Participante} from '../../../model/transport-objects';
import {ObjectReference} from '../../model';

export interface DifferenceArrays<T> {
  addedElements: T[];
  removedElements: T[];
}

@Injectable({providedIn: 'root'})
export class ArrayUtils {
  /**
   * Retorna um array com as diferenças entre um array e sua versão original
   *
   * @template T
   * @param {ObjectReference[]} arrayOriginal
   * @param {ObjectReference[]} arrayAlterada
   * @param {(a: T, b: T) => boolean} compareWith função que compara dois
   *     objetos do tipo T
   * @returns {DifferenceArrays<ObjectReference>}
   * @memberof ArrayUtils
   */
  obtemDiferencaEntreArrays<T>(
    arrayOriginal: T[],
    arrayAlterada: T[],
    compareWith: (a: T, b: T) => boolean,
  ): DifferenceArrays<T> {
    const difference: DifferenceArrays<T> = {
      addedElements: [],
      removedElements: [],
    };

    difference.removedElements = arrayOriginal.filter(
      (a: T) => !arrayAlterada.some((b: T) => compareWith(a, b)),
    );

    difference.addedElements = arrayAlterada.filter(
      (a: T) => !arrayOriginal.some((b: T) => compareWith(a, b)),
    );

    return difference;
  }

  /**
   * Converte um objeto Participante para um array de ObjectReference
   *
   * @param {Participante[]} participantes
   * @returns {ObjectReference[]}
   * @memberof ArrayUtils
   */
  participantesToObjectReferencesArray(participantes: Participante[]): ObjectReference[] {
    return participantes.map((p: Participante) => p.usuarioRef);
  }
}
