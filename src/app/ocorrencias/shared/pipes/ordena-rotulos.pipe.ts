import {Pipe, PipeTransform} from '@angular/core';

import {RotuloDoEvento} from '@model-objects';

@Pipe({name: 'ordenaRotulos'})
export class OrdenaRotulosPipe implements PipeTransform {
  transform(values: RotuloDoEvento[]): RotuloDoEvento[] {
    return !values ? [] :
                     values.sort(
                         (a: RotuloDoEvento, b: RotuloDoEvento) =>
                             ((a.isReservado ? '0' : '1') + a.texto)
                                 .localeCompare(
                                     (b.isReservado ? '0' : '1') + b.texto,
                                     'pt-br', {sensitivity: 'base'}));
  }
}
