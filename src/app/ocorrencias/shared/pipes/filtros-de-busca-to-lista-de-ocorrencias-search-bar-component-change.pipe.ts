import {Pipe, PipeTransform} from '@angular/core';

import {FiltrosDeBusca} from '../../classes-and-interfaces';
import {
  ListaDeOcorrenciasSearchBarComponentChange,
} from '../../lista-de-ocorrencias-search-bar/lista-de-ocorrencias-search-bar.component';

@Pipe({name: 'filtrosDeBuscaToListaDeOcorrenciasSearchBarComponentChange'})
export class FiltrosDeBuscaToListaDeOcorrenciasSearchBarComponentChangePipe
    implements PipeTransform {
  transform(value: FiltrosDeBusca): ListaDeOcorrenciasSearchBarComponentChange {
    return value ? {...value} : {};
  }
}
