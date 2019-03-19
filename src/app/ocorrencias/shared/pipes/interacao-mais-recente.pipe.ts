import {Pipe, PipeTransform} from '@angular/core';

import {HistoricoInteracao} from '@model-objects';

@Pipe({name: 'interacaoMaisRecente'})
export class InteracaoMaisRecentePipe implements PipeTransform {
  transform(values: HistoricoInteracao[]): HistoricoInteracao {
    if (!values || !values.length) {
      return null;
    }

    const historico: HistoricoInteracao[] = [...values];
    historico.sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime(),
    );

    return historico[0];
  }
}
