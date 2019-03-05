import {Pipe, PipeTransform} from '@angular/core';

import {Tutoria} from '../../../model/transport-objects/tutoria';

@Pipe({
  name: 'nomeDeTurma',
})
export class NomeDeTurmaPipe implements PipeTransform {
  transform(tutoria: Tutoria, args?: any): any {
    if (tutoria === undefined || tutoria === null) {
      return '';
    }

    if (tutoria.turmas[0] === undefined || tutoria.turmas[0] === null) {
      return '';
    }

    if (tutoria.turmas[0].grade === undefined || tutoria.turmas[0].grade === null) {
      return '';
    }

    if (tutoria.turmas[0].cursoNome === undefined || tutoria.turmas[0].cursoNome === null) {
      return '';
    }

    if (tutoria.turno === undefined || tutoria.turno === null) {
      return '';
    }

    if (tutoria.unidade === undefined || tutoria.unidade === null) {
      return '';
    }

    if (tutoria.unidade.cidade === undefined || tutoria.unidade.cidade === null) {
      return '';
    }

    if (tutoria.unidade.unidade === undefined || tutoria.unidade.unidade === null) {
      return '';
    }

    const str =
      tutoria.turmas[0].periodo +
      '°' +
      tutoria.turmas[0].grade.toUpperCase() +
      ' ' +
      tutoria.turmas[0].cursoNome.toUpperCase() +
      '-' +
      tutoria.turno.toUpperCase() +
      ':' +
      tutoria.unidade.cidade.toUpperCase() +
      ':' +
      tutoria.unidade.unidade.toUpperCase();

    return str;
  }
}
