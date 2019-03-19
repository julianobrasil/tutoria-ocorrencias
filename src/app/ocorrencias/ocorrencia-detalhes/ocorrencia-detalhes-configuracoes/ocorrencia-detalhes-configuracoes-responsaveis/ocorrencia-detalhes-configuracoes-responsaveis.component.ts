// tslint:disable: max-line-length
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import {ReplaySubject, Subject} from 'rxjs';
import {first, map, takeUntil} from 'rxjs/operators';

import {
  CorDoParticipante,
  OcorrenciaDetalhesComponentService,
} from '../../ocorrencia-detalhes-component.service';

import {ObjectReference, Participante} from '@model-objects';
import {ArrayUtils, DifferenceArrays, SelecaoDePessoasComponent} from '../../../shared';
import {OcorrenciaDetalhesConfiguracoesParticipantesChange} from '../ocorrencia-detalhes-configuracoes-participantes/ocorrencia-detalhes-configuracoes-participantes.component';
// tslint:enable: max-line-length

@Component({
  selector: 'app-ocorrencia-detalhes-configuracoes-responsaveis',
  templateUrl: './ocorrencia-detalhes-configuracoes-responsaveis.component.html',
  styleUrls: ['./ocorrencia-detalhes-configuracoes-responsaveis.component.scss'],
})
export class OcorrenciaDetalhesConfiguracoesResponsaveisComponent
  implements AfterViewInit, OnDestroy {
  /** responsáveis */
  @Input() responsaveis: Participante[];

  /** cores usadas para os participantes */
  @Input() coresDosParticipantes: CorDoParticipante[];

  /** verifica se o usuário logado tem permissão para adicionar responsáveis */
  @Input() podeAdicionarResponsaveis = true;

  /** Emite quando há alterações nos participantes */
  @Output()
  alteracaoDeResponsaveis: EventEmitter<
    OcorrenciaDetalhesConfiguracoesParticipantesChange
  > = new EventEmitter<OcorrenciaDetalhesConfiguracoesParticipantesChange>();

  /**
   * Instância do componente de seleção de pessoas (para obter a quantidade de
   * pessoas selecionadas)
   */
  @ViewChild(SelecaoDePessoasComponent)
  _selecaoDePessoasComponent: SelecaoDePessoasComponent;

  /** indica que os tooltips de usuários estarão habilitados no popover */
  _matUsusarioTooltipDisabled = true;

  /** emite quando há alteração de participantes para ser gravado no banco */
  _participantesAlterados$: ReplaySubject<DifferenceArrays<ObjectReference>> = new ReplaySubject<
    DifferenceArrays<ObjectReference>
  >(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _arrayUtils: ArrayUtils,
    private _ocorrenciaDetalhesComponentService: OcorrenciaDetalhesComponentService,
  ) {}

  ngAfterViewInit() {
    this._setupMonitoramentoAlteracaoDeParticipantes();
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._participantesAlterados$ && !this._participantesAlterados$.closed) {
      this._participantesAlterados$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    this._matUsusarioTooltipDisabled = !popoverFoiAberto;

    this._ocorrenciaDetalhesComponentService.interrompeAtualizacaoPeriodica(popoverFoiAberto);
    if (!popoverFoiAberto) {
      this._participantesAlterados$
        .pipe(first())
        .subscribe((ad: DifferenceArrays<ObjectReference>) => {
          if (
            !(
              ad &&
              ((ad.addedElements && !!ad.addedElements.length) ||
                (ad.removedElements && !!ad.removedElements.length))
            )
          ) {
            // não há alterações
            return;
          }

          this.alteracaoDeResponsaveis.emit({
            participantesAdicionados: ad.addedElements,
            participantesRemovidos: ad.removedElements,
            participantesOriginais: this._arrayUtils.participantesToObjectReferencesArray(
              this.responsaveis,
            ),
          });

          this._participantesAlterados$.next(
            {addedElements: [], removedElements: []});
        });
    }
  }

  get _classesDoCabecalho(): {[key: string]: boolean} {
    return {
      'ocorrencia-detalhes-configuracoes-responsaveis-cabecalho': true,
      'active-link': this.podeAdicionarResponsaveis,
    };
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoAlteracaoDeParticipantes() {
    this._selecaoDePessoasComponent.usuariosEscolhidosChange
      .pipe(
        map(
          (usuariosEscolhidos: ObjectReference[]): DifferenceArrays<ObjectReference> =>
            this._arrayUtils.obtemDiferencaEntreArrays<ObjectReference>(
              this._arrayUtils.participantesToObjectReferencesArray(this.responsaveis),
              usuariosEscolhidos,
              (a: ObjectReference, b: ObjectReference) =>
                a && b && a.code && b.code ? a.code === b.code : false,
            ),
        ),
        takeUntil(this._destroy$),
      )
      .subscribe(this._participantesAlterados$);
  }
}
