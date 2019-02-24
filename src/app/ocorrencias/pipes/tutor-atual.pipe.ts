import {Pipe, PipeTransform} from '@angular/core';

import {Participante} from '../../model/transport-objects';

@Pipe({
  name: 'tutorAtual',
})
export class TutorAtualPipe implements PipeTransform {
  transform(participantes: Participante[]): string {
    if (!participantes || !participantes.length) {
      return '';
    }

    return participantes.find((p: Participante) => p.isAutor).usuarioRef.description;
  }
}
