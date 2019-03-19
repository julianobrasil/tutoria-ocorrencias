import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';

import {ClassificacaoEvento} from '@model-objects';

@Pipe({name: 'labelPorTipo'})
export class LabelPorTipoPipe implements PipeTransform {
  @memo()
  transform(value: ClassificacaoEvento): string {
    switch (value) {
      case ClassificacaoEvento.TUTORIA_GERAL:
      case ClassificacaoEvento.TUTORIA_TUTOR: {
        return 'tutoria';
      }

      case ClassificacaoEvento.OUVIDORIA: {
        return 'ouvidoria';
      }
    }

    return '';
  }
}
