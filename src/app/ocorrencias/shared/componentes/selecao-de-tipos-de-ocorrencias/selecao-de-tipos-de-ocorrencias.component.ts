import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
  MatSnackBar,
} from '@angular/material';

import {combineLatest, Subject} from 'rxjs';
import {
  concatMapTo,
  debounceTime,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  SelecaoDeTiposDeOcorrenciaComponentService,
} from './selecao-de-tipos-de-ocorrencias-component.service';

import {
  TIPO_DE_OCORRENCIA_SERVICE_ADAPTER,
  TipoDeOcorrenciaServiceAdapter,
  TipoSubtipoInfo,
} from './tipos-de-ocorrencia-service-adapter';

@Component({
  selector: 'app-selecao-de-tipos-de-ocorrencias',
  templateUrl: './selecao-de-tipos-de-ocorrencias.component.html',
  styleUrls: ['./selecao-de-tipos-de-ocorrencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'selecaoTiposComponent',
})
export class SelecaoDeTiposDeOcorrenciasComponent implements AfterViewInit,
    OnDestroy {
  /** tipos escolhidos */
  @Input()
  get tiposEscolhidos(): TipoSubtipoInfo[] {
    return this._tiposEscolhidos;
  }
  set tiposEscolhidos(value: TipoSubtipoInfo[]) {
    this._tiposEscolhidos =
        value && value.length !== undefined && value !== null ? [...value] :
                                                                value;

    this._tiposEscolhidos$.next(this._tiposEscolhidos);
  }
  private _tiposEscolhidos: TipoSubtipoInfo[] = [];
  private _tiposEscolhidos$: Subject<TipoSubtipoInfo[]> =
      new Subject<TipoSubtipoInfo[]>();

  /** emite quando há alteração dos tipos escolhidos */
  @Output()
  tiposEscolhidosChange: EventEmitter<TipoSubtipoInfo[]> =
      new EventEmitter<TipoSubtipoInfo[]>();

  /** lista de escolhas */
  @ViewChild(MatSelectionList) _matSelectionList: MatSelectionList;

  /** controle do componente de filtragem */
  _filtroCtrl: FormControl = new FormControl('');

  /** tipos disponíveis no momento */
  _tiposDisponiveis: TipoSubtipoInfo[];

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(TIPO_DE_OCORRENCIA_SERVICE_ADAPTER)
              private _tipoDeOcorrenciaAdapterService:
                  TipoDeOcorrenciaServiceAdapter,
              private _selecaoDeTiposDeOcorrenciaComponentService:
                  SelecaoDeTiposDeOcorrenciaComponentService,
              private _snakbar: MatSnackBar, private _cd: ChangeDetectorRef) {}

  ngAfterViewInit() { this._setupFiltroDeTiposDeOcorrencia(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._tiposEscolhidos$ && !this._tiposEscolhidos$.closed) {
      this._tiposEscolhidos$.complete();
    }
  }

  /**
   * Mantém o estado dos tipos escolhidos
   *
   * @param {MatSelectionListChange} change
   * @memberof SelecaoDeTiposDeOcorrenciaComponent
   */
  _alteracaoNaListaEscolhida(change: MatSelectionListChange) {
    if (change.option.selected) {
      // Algum tipo foi selecionado...
      if (!this._tiposEscolhidos.some(
              (u: TipoSubtipoInfo) =>
                  u.nomeTipo === change.option.value.nomeTipo &&
                  u.nomeSubtipo === change.option.value.nomeSubtipo)) {
        // O tipo selecionado não estava na lista de escolhidos ainda (sei lá
        // por quê)...
        this._tiposEscolhidos.push(change.option.value);
      }
    } else {
      // Algum tipo teve sua seleção cancelada...
      const index = this._tiposEscolhidos.findIndex(
          (u: TipoSubtipoInfo) => u.nomeTipo === change.option.value.nomeTipo);

      if (index > -1) {
        // Se o tipo for encontrado na lista dos escolhidos...
        this._tiposEscolhidos.splice(index, 1);
      }
    }

    this.tiposEscolhidosChange.emit(this._tiposEscolhidos);
  }

  /** monitora o que o tipo está digitando */
  private _setupFiltroDeTiposDeOcorrencia() {
    combineLatest(this._filtroCtrl.valueChanges.pipe(startWith('')),
                  this._tiposEscolhidos$.pipe(startWith([])))
        .pipe(
            startWith(['', []]), debounceTime(300), map(([valor, _]) => valor),
            switchMap(
                (valor: string) =>
                    this._tipoDeOcorrenciaAdapterService
                        .obtemCentroDeCustosPorNomeDeTipoOuSubtipoDeOcorrencia(
                            0, 20, valor)),
            tap((tipos: TipoSubtipoInfo[]) => {
              this._selecaoDeTiposDeOcorrenciaComponentService
                  ._adicionaTiposDeOcorrenciaSeNaoExistir(
                      tipos, this._tiposEscolhidos);
              this._tiposDisponiveis = tipos;
              this._cd.markForCheck();
            }),
            concatMapTo(this._matSelectionList.options.changes),
            takeUntil(this._destroy$))
        .subscribe((_) => this._selecionaUsuariosJaEscolhidos());
  }

  /**
   * Quando chegam tipos no componente, pode ser que alguns deles já estejam
   * escolhidos. Eles devem ser marcados na lista.
   *
   * @private
   * @memberof SelecaoDeTiposDeOcorrenciaComponent
   */
  private _selecionaUsuariosJaEscolhidos() {
    if (this._tiposEscolhidos) {
      this._matSelectionList.options.forEach((item: MatListOption) => {
        if (this._tiposEscolhidos.some((u: TipoSubtipoInfo) =>
                                           u.nomeTipo === item.value.nomeTipo &&
                                           u.nomeSubtipo ===
                                               item.value.nomeSubtipo)) {
          // Usuário deveria estar selecionado...
          if (!item.selected) {
            // Seleciona se não estiver...
            item.toggle();
          }
        }
      });
    }

    this._cd.markForCheck();
  }
}
