// tslint:disable: max-line-length
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {MatSlideToggleChange} from '@angular/material';

// tslint:disable-next-line: no-implicit-dependencies
import {ObjectReference, RotuloDoEvento} from '@model-objects';

import {
  TipoSubtipoInfo,
} from '../shared/componentes/selecao-de-tipos-de-ocorrencias/tipos-de-ocorrencia-service-adapter';
import {
  SearchBarFiltroCursoComponentChange,
} from './search-bar-filtro-curso/search-bar-filtro-curso.component';
import {
  SearchBarFiltroPessoaComponentChange,
} from './search-bar-filtro-pessoa/search-bar-filtro-pessoa.component';
import {
  SearchBarFiltroRotuloComponentChange,
} from './search-bar-filtro-rotulo/search-bar-filtro-rotulo.component';
import {
  SearchBarFiltroTipoDeOcorrenciaComponentChange,
} from './search-bar-filtro-tipos-de-ocorrencias/search-bar-filtro-tipos-de-ocorrencias.component';

// tslint:enable: max-line-length

export class ListaDeOcorrenciasSearchBarComponentChange {
  /**
   * code: id do centro de curso
   * description: nome do curso
   * extra: unidade
   */
  cursosRef?: ObjectReference[];

  autorRef?: ObjectReference;
  responsaveisRef?: ObjectReference[];
  rotulos?: RotuloDoEvento[];
  rotulosAplicativos?: RotuloDoEvento[];
  rotulosAplicativosIds?: string[];
  rotulosIds?: string[];
  tiposDeOcorrenciasInfo?: TipoSubtipoInfo[];
  isAberta?: boolean;
  isFechada?: boolean;

  constructor() {
    this.autorRef = null;
    this.cursosRef = [];
    this.responsaveisRef = [];
    this.rotulos = [];
    this.rotulosAplicativos = [];
    this.rotulosAplicativosIds = [];
    this.rotulosIds = [];
    this.tiposDeOcorrenciasInfo = [];
    this.isAberta = true;
    this.isFechada = false;
  }
}

@Component({
  selector: 'app-lista-de-ocorrencias-search-bar',
  templateUrl: './lista-de-ocorrencias-search-bar.component.html',
  styleUrls: ['./lista-de-ocorrencias-search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaDeOcorrenciasSearchBarComponent {
  /** Ajusta filtros de busca */
  @Input()
  get filtrosDeBusca(): ListaDeOcorrenciasSearchBarComponentChange {
    return this._filtrosDeBusca;
  }
  set filtrosDeBusca(value: ListaDeOcorrenciasSearchBarComponentChange) {
    this._filtrosDeBusca = value;
    this._isTutoriaSelecionada =
        !!(value.rotulosAplicativosIds && value.rotulosAplicativosIds.length);
    this._ultimaAlteracao = value ? {...value} : {};
  }
  private _filtrosDeBusca: ListaDeOcorrenciasSearchBarComponentChange;

  /** Quantidade de ocorrências existentes no momento */
  @Input() numeroDeOcorrencias = 0;

  /** Emite quando o filtro é alterado */
  @Output()
  filtroChange: EventEmitter<ListaDeOcorrenciasSearchBarComponentChange> =
      new EventEmitter<ListaDeOcorrenciasSearchBarComponentChange>();

  /** Grava o último filtro aplicado */
  _ultimaAlteracao: ListaDeOcorrenciasSearchBarComponentChange =
      new ListaDeOcorrenciasSearchBarComponentChange();

  /** True quando a tutoria estiver selecionada e false quando não estiver */
  _isTutoriaSelecionada = false;

  /**
   * Limpa todos os filtros. Observe que apensar de  não
   *
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _limpaTodosOsFiltros() {
    this.filtroChange.emit(new ListaDeOcorrenciasSearchBarComponentChange());
  }

  /**
   * Houve alteração nos rótulos selecionados
   *
   * @param {SearchBarFiltroRotuloComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _rotulosSelecionados(change: SearchBarFiltroRotuloComponentChange) {
    this._ultimaAlteracao.rotulosIds =
        change.rotulos.map((r: RotuloDoEvento) => r.id);
    this._ultimaAlteracao.rotulos = change.rotulos;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração nos aplicativos selecionados
   *
   * @param {SearchBarFiltroRotuloComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _aplicativosSelecionados(change: SearchBarFiltroRotuloComponentChange) {
    this._ultimaAlteracao.rotulosAplicativosIds =
        change.rotulos.map((r: RotuloDoEvento) => r.id);

    this._ultimaAlteracao.rotulosAplicativos = change.rotulos;

    this._isTutoriaSelecionada = change.rotulos.some(
        (r: RotuloDoEvento) => r.texto.toUpperCase() === 'TUTORIA');

    if (!this._isTutoriaSelecionada) {
      this._ultimaAlteracao.cursosRef = [];
    }

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração nos cursos selecionados
   *
   * @param {SearchBarFiltroCursoComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _cursosSelecionados(change: SearchBarFiltroCursoComponentChange) {
    this._ultimaAlteracao.cursosRef = change.cursosRef;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração nos tipos de ocorrência selecionados
   *
   * @param {SearchBarFiltroTipoDeOcorrenciaComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _tiposDeOcorrenciasSelecionados(
      change: SearchBarFiltroTipoDeOcorrenciaComponentChange) {
    this._ultimaAlteracao.tiposDeOcorrenciasInfo =
        change.tiposDeOcorrenciasInfo;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração nos responsáveis selecionados
   *
   * @param {SearchBarFiltroPessoaComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _responsaveisSelecionados(change: SearchBarFiltroPessoaComponentChange) {
    this._ultimaAlteracao.responsaveisRef = change.pessoasRef;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração no autor selecionado
   *
   * @param {SearchBarFiltroPessoaComponentChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _autorSelecionado(change: SearchBarFiltroPessoaComponentChange) {
    this._ultimaAlteracao.autorRef =
        change.pessoasRef && change.pessoasRef.length ? change.pessoasRef[0] :
                                                        null;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração no estado "fechadas"
   *
   * @param {MatSlideToggleChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _fechadasSelecionadas(change: MatSlideToggleChange) {
    this._ultimaAlteracao.isFechada = change.checked;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }

  /**
   * Houve alteração no estado "abertas"
   *
   * @param {MatSlideToggleChange} change
   * @memberof ListaDeOcorrenciasSearchBarComponent
   */
  _abertasSelecionadas(change: MatSlideToggleChange) {
    this._ultimaAlteracao.isAberta = change.checked;

    this.filtroChange.emit({...this._ultimaAlteracao});
  }
}
