// tslint:disable: max-line-length
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
} from '@angular/material';

import {Subject} from 'rxjs';
import {
  concatMapTo,
  debounceTime,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import {
  SelecaoDeRotulosComponentService,
} from './selecao-de-rotulos-component.service';

import {RotuloDoEvento} from '../../../../model/transport-objects';
import {
  ROTULOS_SERVICE_ADAPTER,
  RotuloServiceAdapter,
} from './rotulo-service-adapter';
// tslint:enable: max-line-length

@Component({
  selector: 'app-selecao-de-rotulos',
  templateUrl: './selecao-de-rotulos.component.html',
  styleUrls: ['./selecao-de-rotulos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'selecaoDeRotulosComponent',
})
export class SelecaoDeRotulosComponent implements OnDestroy,
    AfterViewInit {
  /** rótulos escolhidos */
  @Input()
  get rotulosEscolhidos(): RotuloDoEvento[] {
    return this._rotulosEscolhidos;
  }
  set rotulosEscolhidos(value: RotuloDoEvento[]) {
    this._rotulosEscolhidos = value;

    if (this._rotulosEscolhidos) {
      this._rotulosEscolhidos =
          this._rotulosEscolhidos.filter((r: RotuloDoEvento) => !r.isReservado);
    }

    this._rotulosEscolhidos$.next(value);
  }
  private _rotulosEscolhidos: RotuloDoEvento[] = [];
  private _rotulosEscolhidos$: Subject<RotuloDoEvento[]> =
      new Subject<RotuloDoEvento[]>();

  /** emite quando há alteração dos rótulos escolhidos */
  @Output()
  rotulosEscolhidosChange: EventEmitter<RotuloDoEvento[]> =
      new EventEmitter<RotuloDoEvento[]>();

  /** lista de escolhas */
  @ViewChild(MatSelectionList) _matSelectionList: MatSelectionList;

  /** controle do componente de filtragem */
  _filtroCtrl: FormControl = new FormControl('');

  /** rótulos disponíveis no momento */
  _rotulosDisponiveis: RotuloDoEvento[];

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(ROTULOS_SERVICE_ADAPTER)
              private _selecaoDeRotulosAdapterService: RotuloServiceAdapter,
              private _selecaoDeRotulosComponentService:
                  SelecaoDeRotulosComponentService,
              private _cd: ChangeDetectorRef) {}

  ngAfterViewInit() { this._setupFiltroDeRotulos(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /**
   * Mantém o estado dos rótulos escolhidos
   *
   * @param {MatSelectionListChange} change
   * @memberof SelecaoDeRotulosComponent
   */
  _alteracaoNaListaEscolhida(change: MatSelectionListChange) {
    if (change.option.selected) {
      // Algum U=rótulo foi selecionado...
      if (!this._rotulosEscolhidos.some((u: RotuloDoEvento) =>
                                            u.id === change.option.value.id)) {
        // O rótulo selecionado não estava na lista de escolhidos ainda (sei lá
        // por quê)...
        this._rotulosEscolhidos.push(change.option.value);
      }
    } else {
      // Algum rótulo teve sua seleção cancelada...
      const index = this._rotulosEscolhidos.findIndex(
          (u: RotuloDoEvento) => u.id === change.option.value.id);

      if (index > -1) {
        // Se o rótulo for encontrado na lista dos escolhidos...
        this._rotulosEscolhidos.splice(index, 1);
      }
    }

    this.rotulosEscolhidosChange.emit(this._rotulosEscolhidos);
  }

  /** monitora o que o rótulo está digitando */
  private _setupFiltroDeRotulos() {
    this._filtroCtrl.valueChanges
        .pipe(startWith(''), debounceTime(300),
              switchMap(
                  (valor: string) =>
                      this._selecaoDeRotulosAdapterService.obtemRotulos(valor)),
              tap((rotulos: RotuloDoEvento[]) => {
                this._selecaoDeRotulosComponentService
                    ._adicionaRotulosSeNaoExistir(rotulos,
                                                  this._rotulosEscolhidos);
                this._rotulosDisponiveis = rotulos;
                this._cd.markForCheck();
              }),
              concatMapTo(this._matSelectionList.options.changes),
              takeUntil(this._destroy$))
        .subscribe((_) => this._selecionaUsuariosJaEscolhidos());
  }

  /**
   * Quando chegam rótulos do banco, pode ser que alguns deles já estejam
   * escolhidos. Eles devem ser marcados na lista.
   *
   * @private
   * @memberof SelecaoDeRotulosComponent
   */
  private _selecionaUsuariosJaEscolhidos() {
    if (this._rotulosEscolhidos) {
      this._matSelectionList.options.forEach((item: MatListOption) => {
        if (this._rotulosEscolhidos.some((u: RotuloDoEvento) =>
                                             u.id === item.value.id)) {
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
