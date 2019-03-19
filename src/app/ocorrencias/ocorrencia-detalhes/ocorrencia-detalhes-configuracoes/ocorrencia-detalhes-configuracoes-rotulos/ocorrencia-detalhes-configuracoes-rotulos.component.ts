// tslint:disable: max-line-length
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import {ReplaySubject, Subject} from 'rxjs';
import {first, map, takeUntil, tap} from 'rxjs/operators';

import {
  OcorrenciaDetalhesComponentService,
} from '../../ocorrencia-detalhes-component.service';

import {
  SelecaoDeRotulosComponent,
} from '../../../shared/componentes/selecao-de-rotulos/selecao-de-rotulos.component';

import {
  ClassificacaoEvento,
  Evento,
  RotuloDoEvento,
} from '@model-objects';
import {ArrayUtils, DifferenceArrays} from '../../../shared';

// tslint:enable: max-line-length

export interface OcorrenciaDetalhesConfiguracoesRotulosChange {
  rotulosAdicionadosIds: string[];
  rotulosRemovidosIds: string[];
  rotulosOriginaisIds: string[];
}

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-rotulos',
  templateUrl: './ocorrencia-detalhes-configuracoes-rotulos.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-rotulos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaDetalhesConfiguracoesRotulosComponent implements
    AfterViewInit,
    OnDestroy {
  /** ocorrência */
  @Input()
  get ocorrencia(): Evento {
    return this._ocorrencia;
  }
  set ocorrencia(value: Evento) {
    this._ocorrencia = value;
    this._rotulos = [...this._ocorrencia.rotulos];
  }
  private _ocorrencia: Evento;

  /** rótulos do evento (para não mexer em ocorrência antes de gravar) */
  _rotulos: RotuloDoEvento[] = [];

  /**
   * verifica se o usuário logado tem permissão para adicionar/remover rótulos
   */
  @Input() podeAdicionarRotulos = true;

  /** Emite quando há alterações nos rótulos */
  @Output()
  alteracaoDeRotulos:
      EventEmitter<OcorrenciaDetalhesConfiguracoesRotulosChange> =
          new EventEmitter<OcorrenciaDetalhesConfiguracoesRotulosChange>();

  /**
   * Instância do componente de seleção de rótulos (para obter a quantidade de
   * rótulos selecionadas)
   */
  @ViewChild(SelecaoDeRotulosComponent)
  _selecaoDeRotulosComponent: SelecaoDeRotulosComponent;

  /** emite quando há alteração de rótulos para ser gravado no banco */
  private _rotulosAlterados$: ReplaySubject<DifferenceArrays<RotuloDoEvento>> =
      new ReplaySubject<DifferenceArrays<RotuloDoEvento>>(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _arrayUtils: ArrayUtils,
              private _ocorrenciaDetalhesComponentService:
                  OcorrenciaDetalhesComponentService) {}

  ngAfterViewInit() { this._setupMonitoramentoAlteracaoDeRotulos(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._rotulosAlterados$ && !this._rotulosAlterados$.closed) {
      this._rotulosAlterados$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(
        popoverFoiAberto);
    if (!popoverFoiAberto) {
      this._rotulosAlterados$.pipe(first())
          .subscribe((ad: DifferenceArrays<RotuloDoEvento>) => {
            if (!(ad &&
                  ((ad.addedElements && !!ad.addedElements.length) ||
                   (ad.removedElements && !!ad.removedElements.length)))) {
              // não há alterações
              return;
            }

            this.alteracaoDeRotulos.emit({
              rotulosAdicionadosIds:
                  ad.addedElements.map((item: RotuloDoEvento) => item.id),
              rotulosRemovidosIds:
                  ad.removedElements.map((item: RotuloDoEvento) => item.id),
              rotulosOriginaisIds:
                  this._rotulos.map((item: RotuloDoEvento) => item.id),
            });

            this._rotulosAlterados$.next(
                {addedElements: [], removedElements: []});
          });
    }
  }

  get _classesDoCabecalho(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-configuracoes-rotulos-cabecalho': true,
      'active-link': this.podeAdicionarRotulos,
    };
  }

  /** apresenta a palavra nenhum se não houver nenhum rótulo associado */
  get _mostraIndicadorNenhumLabel(): boolean {
    if (!this.ocorrencia) {
      return false;
    }

    const ocorrenciaComum = this.ocorrencia.classificacaoEvento ===
                            ClassificacaoEvento.OCORRENCIA_COMUM;

    const nenhumRotulo =
        this.ocorrencia.rotulos && !this.ocorrencia.rotulos.length;

    return ocorrenciaComum && nenhumRotulo;
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoAlteracaoDeRotulos() {
    this._selecaoDeRotulosComponent.rotulosEscolhidosChange
        .pipe(
            map((rotulosEscolhidos:
                     RotuloDoEvento[]): DifferenceArrays<RotuloDoEvento> =>
                    this._arrayUtils.obtemDiferencaEntreArrays<RotuloDoEvento>(
                        this.ocorrencia.rotulos.filter((r: RotuloDoEvento) =>
                                                           !r.isReservado),
                        rotulosEscolhidos,
                        (a: RotuloDoEvento, b: RotuloDoEvento) =>
                            a && b && a.id && b.id ? a.id === b.id : false)),
            takeUntil(this._destroy$))
        .subscribe(this._rotulosAlterados$);
  }
}
