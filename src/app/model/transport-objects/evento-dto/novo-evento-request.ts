import {
  OcorrenciaFormularioComponentData,
} from '../../../ocorrencias/ocorrencia-formulario/ocorrencia-formulario-component.service';
import {ClassificacaoEvento} from '../evento';
import {TextoFormatado} from '../texto-formatado';

export class NovoEventoRequest {
  tutoriaId: string;

  /** formato CIDADE:UNIDADE */
  cidadeUnidade: string;
  titulo: '';

  tipoEventoId: string;
  subTipoEventoNome: string;
  dataEvento: Date | string;
  textoFormatado: TextoFormatado;
  local: string;
  isResolvido: boolean;
  classificacaoEvento?: ClassificacaoEvento;

  /** importa dados do formulário de ocorrência (criação de um evento novo) */
  importFromDadosDeFormularioDeOcorrencia(
      dados: OcorrenciaFormularioComponentData): void {
    this.tutoriaId = dados.tutoria ? dados.tutoria.id : null;

    this.cidadeUnidade =
        dados.unidade ? `${dados.unidade.cidade}:${dados.unidade.unidade}` :
                        null;

    this.titulo = dados.titulo;
    this.tipoEventoId = dados.tipoEvento ? dados.tipoEvento.id : null;
    this.subTipoEventoNome =
        dados.subTipoEvento ? dados.subTipoEvento.nomeSubTipoEvento : null;
    this.dataEvento = dados.dataEvento;
    this.textoFormatado = {
      markdown: dados.parecer ? dados.parecer : '',
    };
    this.local = dados.local ? dados.local : '';
    this.isResolvido = !!dados.isResolvido;
  }
}
