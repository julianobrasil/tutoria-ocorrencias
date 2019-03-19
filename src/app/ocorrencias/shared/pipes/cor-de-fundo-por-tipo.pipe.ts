import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';

import {ClassificacaoEvento} from '@model-objects';

@Pipe({name: 'corDeFundoPorTipo'})
export class CorDeFundoPorTipoPipe implements PipeTransform {
  @memo()
  transform(value: ClassificacaoEvento): string {
    switch (value) {
      case ClassificacaoEvento.TUTORIA_GERAL:
      case ClassificacaoEvento.TUTORIA_TUTOR: {
        return '#FFFF00';
      }

      case ClassificacaoEvento.OUVIDORIA: {
        return '#FF0000';
      }
    }

    return '';
  }
}
