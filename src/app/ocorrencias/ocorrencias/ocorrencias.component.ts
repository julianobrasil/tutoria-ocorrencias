import {ChangeDetectionStrategy, Component} from '@angular/core';

import {combineLatest, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

import {OcorrenciaFacadeService, Paginacao} from '../ocorrencia-facade.service';

import {Evento} from '../../model/transport-objects/to';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciasComponent {
  /** dados de eventos paginados */
  _eventos$: Observable<Evento[]> = this._ocorrenciaStoreFacade.getEventos();

  /** dados de paginação */
  _paginacao$: Observable<Paginacao> = this._ocorrenciaStoreFacade.getPaginacao();

  constructor(private _ocorrenciaStoreFacade: OcorrenciaFacadeService) {
    combineLatest(this._paginacao$)
      .pipe(
        first(),
        map((_) => _[0]),
      )
      .subscribe((paginacao: Paginacao) => {
        if (!paginacao) {
          this._ocorrenciaStoreFacade.setPaginacao({
            page: 0,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20, 50],
          });
        }

        this._ocorrenciaStoreFacade.setTermoDeBuscaEBusca('');
      });
  }

  /** filtra os eventos existentes */
  _filtraEventos(termo: string | null | undefined) {
    this._ocorrenciaStoreFacade.setTermoDeBuscaEBusca(termo);
  }

  /** atualiza os dados de paginação */
  _atualizaPaginacao(paginacao: Paginacao) {
    this._ocorrenciaStoreFacade.setPaginacaoEBusca(paginacao);
  }
}
