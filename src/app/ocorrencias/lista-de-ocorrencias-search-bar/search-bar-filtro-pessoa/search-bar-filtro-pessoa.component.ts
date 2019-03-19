// tslint:disable: max-line-length
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {SatPopover} from '@ncstate/sat-popover';
import {ReplaySubject, Subject} from 'rxjs';
import {first, takeUntil, tap} from 'rxjs/operators';

// tslint:disable-next-line: no-implicit-dependencies
import {ObjectReference} from '@model-objects';
import {ArrayUtils, DifferenceArrays} from '../../shared';
import {
  SelecaoDePessoasComponent,
} from '../../shared/componentes/selecao-de-pessoas/selecao-de-pessoas.component';
// tslint:enable: max-line-length

export interface SearchBarFiltroPessoaComponentChange {
  pessoasRef: ObjectReference[];
}

@Component({
  selector: 'app-search-bar-filtro-pessoa',
  templateUrl: './search-bar-filtro-pessoa.component.html',
  styleUrls: ['./search-bar-filtro-pessoa.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFiltroPessoaComponent implements OnDestroy,
    AfterViewInit {
  /** Histórico da última seleção feita */
  @Input() pessoasDaUltimaSelecao: ObjectReference[] = [];

  /** Se é possível selecionar mais de um usuário */
  @Input() multi = true;

  /** Emite quando há alterações na pessoa */
  @Output()
  pessoasSelecionadasChange:
      EventEmitter<SearchBarFiltroPessoaComponentChange> =
          new EventEmitter<SearchBarFiltroPessoaComponentChange>();

  /**
   * Instância do componente de seleção de pessoas (para obter a quantidade de
   * pessoas selecionadas)
   */
  @ViewChild(SelecaoDePessoasComponent)
  _selecaoDePessoasComponent: SelecaoDePessoasComponent;

  /** Instância do popover */
  @ViewChild(SatPopover) _popover: SatPopover;

  /** indica que os tooltips de usuários estarão habilitados no popover */
  _matUsusarioTooltipDisabled = true;

  /** emite quando há alteração de participantes para ser gravado no banco */
  private _pessoasSelecionadas$: ReplaySubject<ObjectReference[]> =
      new ReplaySubject<ObjectReference[]>(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _arrayUtils: ArrayUtils) {}

  ngAfterViewInit() { this._setupMonitoramentoSelecaoDePessoas(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._pessoasSelecionadas$ && !this._pessoasSelecionadas$.closed) {
      this._pessoasSelecionadas$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    this._matUsusarioTooltipDisabled = !popoverFoiAberto;

    if (!popoverFoiAberto) {
      this._pessoasSelecionadas$.pipe(first())
          .subscribe((pessoas: ObjectReference[]) => {
            const ad: DifferenceArrays<ObjectReference> =
                this._arrayUtils.obtemDiferencaEntreArrays<ObjectReference>(
                    this.pessoasDaUltimaSelecao, pessoas,
                    (a: ObjectReference, b: ObjectReference) =>
                        a && b && a.code && b.code ? a.code === b.code : false);

            if (!(ad &&
                  ((ad.addedElements && !!ad.addedElements.length) ||
                   (ad.removedElements && !!ad.removedElements.length)))) {
              // não há alterações
              return;
            }

            this.pessoasDaUltimaSelecao = [...pessoas];

            this.pessoasSelecionadasChange.emit({
              pessoasRef: pessoas,
            });

            this._pessoasSelecionadas$.next(pessoas);
          });
    }
  }

  /** Limpa o filtro de pessoas */
  _limpaFiltro() {
    this.pessoasDaUltimaSelecao = [];
    this.pessoasSelecionadasChange.emit({pessoasRef: []});

    this._pessoasSelecionadas$.next([]);
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoSelecaoDePessoas() {
    this._selecaoDePessoasComponent.usuariosEscolhidosChange
        .pipe(
            // Em caso de permitir somente uma seleção, fecha o popover
            // imediatamente...
            tap((_) => {
              if (!this.multi) {
                this._popover.close();
                this.pessoasDaUltimaSelecao = [];
              }
            }),
            takeUntil(this._destroy$))
        .subscribe(this._pessoasSelecionadas$);
  }
}
