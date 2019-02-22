import {Pipe, PipeTransform} from '@angular/core';

import {Tutoria} from '../../model/transport-objects/tutoria';

@Pipe({
  name: 'tutoriasComTurmas',
  pure: false,
})
export class TutoriasComTurmasPipe implements PipeTransform {
  transform(tutorias: any[], args?: any): any {
    return tutorias.filter((a: any) => a.tutoria.turmas.length > 0);
  }
}
