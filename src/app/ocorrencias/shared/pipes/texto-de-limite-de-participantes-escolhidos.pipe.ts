import {Pipe, PipeTransform} from '@angular/core';

import {ObjectReference} from '../../../model/transport-objects';

@Pipe({name: 'textoDeLimiteDeParticipantesEscolhidos'})
export class TextoDeLimiteDeParticipantesEscolhidosPipe implements
    PipeTransform {
  transform(usuarios: ObjectReference[], maxUsuarios: number): string {
    if (maxUsuarios < 0) {
      return '';
    }

    if (maxUsuarios > 0 && (usuarios && usuarios.length === maxUsuarios)) {
      return 'Máximo de pessoas atingido: ' + maxUsuarios;
    }

    return maxUsuarios > 1 ?
               'Você pode escolher até ' + maxUsuarios + ' pessoas' :
               maxUsuarios === 1 ? 'Você pode escolher até 1 pessoa' : '';
  }
}
