import {Pipe, PipeTransform} from '@angular/core';

import {RotuloDoEvento} from '../../../model/transport-objects';

@Pipe({name: 'isRotuloImexivel'})
export class IsRotuloImexivelPipe implements PipeTransform {
  transform(rotulo: RotuloDoEvento,
            rotulosImexiveis: RotuloDoEvento[]): boolean {
    return rotulosImexiveis ?
               rotulosImexiveis.some((u: RotuloDoEvento) =>
                                         u.id === rotulo.id) :
               false;
  }
}
