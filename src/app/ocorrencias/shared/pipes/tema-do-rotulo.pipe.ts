import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';
import {GeradorDeCoresService} from '../utilitarios/gerador-de-cores.service';

@Pipe({name: 'temaDoRotulo'})
export class TemaDoRotuloPipe implements PipeTransform {
  constructor(private _geradorDeCoresService: GeradorDeCoresService) {}

  @memo()
  transform(value: string): {[key: string]: string} {
    return {
      'background-color': value,
      'color': this._geradorDeCoresService.isContrastOkToWhite(value) ? 'white' : 'black',
    };
  }
}
