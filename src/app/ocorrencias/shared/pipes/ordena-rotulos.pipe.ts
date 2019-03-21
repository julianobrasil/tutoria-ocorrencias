import {Pipe, PipeTransform} from '@angular/core';

import {RotuloDoEvento, TipoRotulo} from '@model-objects';

@Pipe({name: 'ordenaRotulos'})
export class OrdenaRotulosPipe implements PipeTransform {
  transform(values: RotuloDoEvento[]): RotuloDoEvento[] {
    return !values ?
               [] :
               values.sort(
                   (a, b) => (this._priorizaAplicacaoParecerEResto(a) + a.texto)
                                 .localeCompare(
                                     this._priorizaAplicacaoParecerEResto(b) +
                                         b.texto,
                                     'pt-br', {sensitivity: 'base'}));
  }

  /**
   * Estabelece uma ordem de prioridade entre Aplicação, Pareceres e Outros
   *
   * @private
   * @param {RotuloDoEvento} a
   * @returns {string}
   * @memberof OrdenaRotulosPipe
   */
  private _priorizaAplicacaoParecerEResto(a: RotuloDoEvento): string {
    return a.isReservado ?
               '0000' :
               a.tipos.some(
                   (tr: TipoRotulo) =>
                       tr === TipoRotulo.PARECER_TUTORIA_PARTICIPANTE_CIENTE ||
                       tr === TipoRotulo.PARECER_TUTORIA) ?
               '0001' :
               '0002';
  }
}
