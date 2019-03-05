import {Pipe, PipeTransform} from '@angular/core';

import {TutoriaNome} from '../../../model/helper-objects/telas/tutoria-helper';
import {Participante} from '../../../model/transport-objects';
import {Tutoria} from '../../../model/transport-objects/';

@Pipe({
  name: 'tutoriaTurmas',
})
export class TutoriaTurmasPipe implements PipeTransform {
  transform(tutoria: Tutoria): string {
    if (!tutoria) {
      return '';
    }

    return new TutoriaNome(tutoria).nome;
  }
}
