import {Pipe, PipeTransform} from '@angular/core';

import {Tutoria} from '@model-objects';
import {TutoriaNome} from '../../../model/helper-objects/telas/tutoria-helper';

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
