import {Component, Input} from '@angular/core';
import {
  HistoricoInteracao,
  RotuloDoEvento,
} from '@model-objects';

@Component({
  selector: 'app-ocorrencia-acao-linha-alteracao-rotulo',
  templateUrl: './ocorrencia-acao-linha-alteracao-rotulo.component.html',
  styleUrls: ['./ocorrencia-acao-linha-alteracao-rotulo.component.scss'],
})
export class OcorrenciaAcaoLinhaAlteracaoRotuloComponent {
  /** histórico de interação com atualização de rótulos */
  @Input()
  get historicoInteracao(): HistoricoInteracao {
    return this._historicoInteracao;
  }
  set historicoInteracao(value: HistoricoInteracao) {
    this._historicoInteracao = value;

    this._rotulosAdicionados =
        value && value.auditoriaAcao && value.auditoriaAcao.valorCorrente ?
            JSON.parse(value.auditoriaAcao.valorCorrente) :
            [];
    this._rotulosRemovidos =
        value && value.auditoriaAcao && value.auditoriaAcao.valorAntigo ?
            JSON.parse(value.auditoriaAcao.valorAntigo) :
            [];
  }
  private _historicoInteracao: HistoricoInteracao;

  /** rótulos que foram adicionados */
  _rotulosAdicionados: RotuloDoEvento[];

  /** rótulos que foram removidos */
  _rotulosRemovidos: RotuloDoEvento[];
}
