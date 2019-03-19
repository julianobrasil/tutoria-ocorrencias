import {Pipe, PipeTransform} from '@angular/core';

import {Interacao} from '@model-objects';

@Pipe({
  name: 'interacoesPorOrdemCronologica',
})
export class InteracoesPorOrdemCronologicaPipe implements PipeTransform {
  transform(values: Interacao[], args?: any): Interacao[] {
    if (!values || !values.length) {
      return [];
    }

    values.sort(
        (a: Interacao, b: Interacao) => new Date(a.dataCriacao).getTime() -
            new Date(b.dataCriacao).getTime(),
    );

    return values;
  }
}
