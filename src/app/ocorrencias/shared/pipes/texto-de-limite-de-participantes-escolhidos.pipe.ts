import {Pipe, PipeTransform} from '@angular/core';

import {ObjectReference} from '../../../model/transport-objects';

@Pipe({name: 'textoDeLimiteDeParticipantesEscolhidos'})
export class TextoDeLimiteDeParticipantesEscolhidosPipe implements
    PipeTransform {
  /**
   * Note que o número de usuários corrente poderia ser obtido a partir do
   * parâmetro "usuarios", mas precisava de uma forma de forçar o angular a
   * executar o transform (sem ser colocando o meta atributo "pure = false").
   * A forma que me parececu mais natural foi colocar o atributo corrente com o
   * número de usuários, que, quando alterado, deve realmente disparar o
   * método transform
   *
   * @param {ObjectReference[]} usuarios
   * @param {{maxUsuarios: number, corrente: number}} args
   *     maxUsuarios: # máximo de usuários
   *     corrente: # de usuários corrente
   * @returns {string}
   * @memberof TextoDeLimiteDeParticipantesEscolhidosPipe
   */
  transform(usuarios: ObjectReference[], args: {
    maxUsuarios: number;
    corrente: number
  }): string {
    if (args.maxUsuarios < 0) {
      return '';
    }

    if (args.maxUsuarios > 0 &&
        (usuarios && usuarios.length === args.maxUsuarios)) {
      return 'Máximo de pessoas atingido: ' + args.maxUsuarios;
    }

    const diferenca = args.maxUsuarios - usuarios.length;

    return diferenca > 1 ? 'Você pode adicionar mais ' + diferenca + ' pessoas' :
                           'Você pode adicionar mais 1 pessoa';
  }
}
