import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sobrenomeAmigavel',
})
export class SobrenomeAmigavelPipe implements PipeTransform {
  transform(value: string, args?: any): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    if (value.indexOf(' ') === -1) {
      return value;
    }

    const array: string[] = value
      .replace(/\s\s+/g, ' ')
      .trim()
      .split(' ');

    if (this.isParticula(array[0])) {
      return array[0] + ' ' + array[1];
    }

    return array[0];
  }

  isParticula(p: string): boolean {
    switch (p.toLocaleLowerCase()) {
      case 'de':
        return true;
      case 'da':
        return true;
      case 'do':
        return true;
      case 'das':
        return true;
      case 'dos':
        return true;
      case 'e':
        return true;
      default:
        return false;
    }
  }
}
