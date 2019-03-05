import {Component, Input} from '@angular/core';
import {Interacao, TipoAcao} from 'src/app/model/transport-objects';
import {CorDoParticipante} from '../ocorrencia-detalhes-component.service';

@Component({
  selector: 'app-ocorrencia-acao',
  templateUrl: './ocorrencia-acao.component.html',
  styleUrls: ['./ocorrencia-acao.component.scss'],
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
    }
  }
}
