import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'negritaOcorrencias',
})
export class NegritaOcorrenciasPipe implements PipeTransform {
  transform(str: any, args?: any): string {
    if (typeof args !== 'string' || !str || !args) {
      return str;
    }
    args = args.split('(').join('').split(')').join('');
    const regexp: RegExp = new RegExp(args, 'ig');

    const splitted = str.split(regexp);

    return splitted.length <= 1 ?
               str :
               str.replace(
                   regexp,
                   `<strong class="app-color-primary">${args.toUpperCase()}</strong>`);
  }
}
