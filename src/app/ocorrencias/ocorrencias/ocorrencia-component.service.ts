import {Injectable} from '@angular/core';

import {TextoFormatado} from '../../model/transport-objects';
import {FormatadorDeTextoService} from '../shared/utilitarios/formatador-de-texto.service';

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