import {Pipe, PipeTransform} from '@angular/core';
import {Evento} from '../../../model/transport-objects';

@Pipe({name: 'localEUnidade'})
export class LocalEUnidadePipe implements PipeTransform {
  transform(value: string, evento?: Evento): string {
    if (!value) {
      return '';
    }
    const unidade = evento.cidadeUnidade ? `
      <strong>UNIDADE: </strong> ${evento.cidadeUnidade}
      <br>
    ` :
                                           '';

    const local = evento.observacao ? `
      <strong>LOCAL: </strong> ${evento.observacao}
      <br>
    ` :
                                      '';

    return unidade + local + value;
  }
}
