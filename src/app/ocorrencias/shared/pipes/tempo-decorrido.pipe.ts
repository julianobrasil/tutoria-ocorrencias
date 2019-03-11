import {Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'tempoDecorrido',
})
export class TempoDecorridoPipe implements PipeTransform {
  transform(value: Date): any {
    if (!value) {
      return '';
    }
    moment.locale('pt-br');

    const agora = new Date();
    const dia = new Date(value);

    const milliseconds = agora.getTime() - dia.getTime();

    const diaMilliseconds = 24 * 60 * 60 * 1000;

    const mesMilliseconds = diaMilliseconds * 30;

    const horaMilliseconds = 60 * 60 * 1000;

    const minutoMilliseconds = 60 * 1000;
    // tslint:disable: max-line-length
    const data =
        minutoMilliseconds > milliseconds ?
            'agora mesmo' :
            horaMilliseconds > milliseconds ?
            this._formata(milliseconds / minutoMilliseconds, 'minuto') :
            diaMilliseconds > milliseconds ?
            this._formata(milliseconds / horaMilliseconds, 'hora') :
            mesMilliseconds > milliseconds ?
            this._formata(milliseconds / diaMilliseconds, 'dia') :
            `em ${moment(dia).format('DD MMM YYYY')}`;

    return data;
  }

  private _formata(quantidade: number, unidade: string): string {
    return `há  ${Math.floor(quantidade)} ${unidade}${this._plural(Math.floor(quantidade))}`;
  }

  /** retorna um se a quantidade for maior que 1 */
  private _plural(quantidade: number): string {
    return quantidade > 1 ? 's' : '';
  }
}
