import {Pipe, PipeTransform} from '@angular/core';
import {FiltrosDeBusca} from '../../classes-and-interfaces';

@Pipe({name: 'barraDeFilragemFiltroAtivado'})
export class BarraDeFilragemFiltroAtivadoPipe implements PipeTransform {
  transform(value: FiltrosDeBusca): boolean {
    const autorFiltrado = value.autorRef;
    const cursosRefFiltrados = value.cursosRef && value.cursosRef.length;
    const responsaveisRefFiltrados =
        value.responsaveisRef && value.responsaveisRef.length;
    const aplicativosFiltrados =
        value.rotulosAplicativosIds && value.rotulosAplicativosIds.length;
    const tiposFiltrados =
        value.tiposDeOcorrenciasInfo && value.tiposDeOcorrenciasInfo.length;

    const rotulosFiltrados = value.rotulosIds && value.rotulosIds.length;
    return !!(autorFiltrado || cursosRefFiltrados || responsaveisRefFiltrados ||
              aplicativosFiltrados || rotulosFiltrados || tiposFiltrados);
  }
}
