import {Component, Input, ViewEncapsulation} from '@angular/core';

import {Interacao, TipoAcao} from '../../../model/transport-objects';
import {CorDoParticipante} from '../ocorrencia-detalhes-component.service';

@Component({
  selector: 'app-ocorrencia-acao',
  templateUrl: './ocorrencia-acao.component.html',
  styleUrls: ['./ocorrencia-acao.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciaAcaoComponent {
  /** acao a ser mostrada */
  private _acao: Interacao;
  @Input()
  get acao(): Interacao {
    return this._acao;
  }
  set acao(i: Interacao) {
    this._acao = i;

    this._setupTheme(i);
  }

  /** cores usadas para os participantes */
  @Input() coresDosParticipantes: CorDoParticipante[];

  /** cor do ícone da ação realizada */
  _theme: string;

  /** ícone a ser usado */
  _icon: string;

  /** tipos de ação disponíveis */
  _tipoAcao = TipoAcao;

  /** configura o tema */
  private _setupTheme(acao: Interacao) {
    switch (acao.historicoInteracoes[0].tipoAcao) {
      case TipoAcao.ENCERRA_OCORRENCIA: {
        this._theme = 'warn';
        this._icon = 'report_off';
        break;
      }

      case TipoAcao.REABRE_OCORRENCIA: {
        this._theme = 'primary';
        this._icon = 'info';
        break;
      }

      case TipoAcao.ALTERA_TIPO: {
        this._theme = 'primary';
        this._icon = 'low_priority';
        break;
      }

      case TipoAcao.ALTERA_LOCAL: {
        this._theme = 'warn';
        this._icon = 'place';
        break;
      }

      case TipoAcao.ALTERA_UNIDADE: {
        this._theme = 'warn';
        this._icon = 'place';
        break;
      }

      case TipoAcao.ALTERA_TITULO: {
        this._theme = 'primary';
        this._icon = 'title';
        break;
      }

      case TipoAcao.ALTERA_VISIBILIDADE_EVENTO: {
        this._theme = 'primary';
        this._icon = 'visibility';
        break;
      }

      case TipoAcao.ALTERA_ROTULO: {
        this._theme = 'accent';
        this._icon = 'label';
        break;
      }
    }
  }
}
