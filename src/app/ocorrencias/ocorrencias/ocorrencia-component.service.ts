import {Injectable} from '@angular/core';

import {
  FormatadorDeTextoService,
} from '../shared/utilitarios/formatador-de-texto.service';

import {
  ObjectReference,
  TextoFormatado,
  Visibilidade,
} from '../../model/transport-objects';

export enum OcorrenciaChangeType {
  ALTERA_LOCAL,
  ALTERA_PARECER,
  ALTERA_PARTICIPANTES,
  ALTERA_RESPONSAVEIS,
  ALTERA_ROTULOS,
  ALTERA_TIPO_SUBTIPO,
  ALTERA_TITULO,
  ALTERA_UNIDADE,
  COMENTA,
  ENCERRA_E_COMENTA,
  EXCLUI_COMENTARIO,
  NOVO_EVENTO,
  REABRE_E_COMENTA,
  TEXTO_COMENTARIO,
  VISIBILIDADE_COMENTARIO,
  VISIBILIDADE_EVENTO,
  /** Used when dealing with the update of data in the custom form */
  CUSTOM_TYPE,
}

export interface OcorrenciaChange {
  type: OcorrenciaChangeType;
  customType?: string;
  eventoId?: string;
  comentarioId?: string;
  visibilidade?: Visibilidade;
  texto?: string;
  descricaoTipoEvento?: string;
  descricaoSubTipoEvento?: string;
  participantesAdicionados?: ObjectReference[];
  participantesRemovidos?: ObjectReference[];
  rotulosAdicionadosIds?: string[];
  rotulosRemovidosIds?: string[];
}

@Injectable({providedIn: 'root'})
export class OcorrenciaComponentService {
  constructor(private _formatadorDeTextoService: FormatadorDeTextoService) {}

  /**
   * Completa as propriedades html e semFormatacao do objeto TextoFormatado
   * recebido como parâmetro. É necessário que a propriedade textoFormatado
   * tenha algum valor.
   *
   * @param {TextoFormatado} textoFormatado contendo a propriedade markdown
   *     preenchida
   * @memberof OcorrenciaComponentService
   */
  complementaDadosDeTexto(textoFormatado: TextoFormatado): void {
    textoFormatado.html =
        this._formatadorDeTextoService.markdownToHtml(textoFormatado.markdown);
    textoFormatado.semFormatacao =
        this._formatadorDeTextoService.limpaMarkdown(textoFormatado.markdown);
  }
}
