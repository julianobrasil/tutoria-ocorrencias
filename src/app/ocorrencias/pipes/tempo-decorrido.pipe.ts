import {Pipe, PipeTransform} from '@angular/core';

import * as moment from 'moment';

@Pipe({
  name: 'tempoDecorrido',
})
export class TempoDecorridoPipe implements PipeTransform {
  transform(value: Date): any {
    moment.locale('pt-br');

    const agora = new Date();
    const dia = new Date(value);

    const milliseconds = agora.getTime() - dia.getTime();

    const diaMilliseconds = 24 * 60 * 60 * 1000;

    const mesMilliseconds = diaMilliseconds * 30;

    const data =
      diaMilliseconds > milliseconds
        ? 'há ' + milliseconds / (1000 * 60 * 60) + ' horas'
        : mesMilliseconds > milliseconds
        ? 'há ' + milliseconds / (1000 * 60 * 60 * 24) + ' dias'
        : 'em ' + moment(agora).format('DD MMM/YYYY');

    return data;
  }
}
