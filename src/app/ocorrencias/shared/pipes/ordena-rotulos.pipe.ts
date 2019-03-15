import {Pipe, PipeTransform} from '@angular/core';

import {RotuloDoEvento} from '../../../model/transport-objects';

@Pipe({name: 'ordenaRotulos'})
export class OrdenaRotulosPipe implements PipeTransform {
  transform(values: RotuloDoEvento[]): RotuloDoEvento[] {
    return !values ?
               [] :
               values.sort((a: RotuloDoEvento, b: RotuloDoEvento) =>
                               a.texto.localeCompare(b.texto, 'pt-br',
                                                     {sensitivity: 'base'}));
  }
}
