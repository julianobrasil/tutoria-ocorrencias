import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';

import * as marked from 'marked';

@Injectable({
  providedIn: 'root',
})
export class FormatadorDeTextoService {
  constructor(@Inject(DOCUMENT) private _document: Document) {
    marked.setOptions({
      breaks: true,
    });
  }

  /**
   * Transforma um texto markdonw em um texto HTML
   *
   * @param {string} markdownText
   * @returns
   * @memberof FormatadorDeTextoService
   */
  markdownToHtml(markdownText: string) {
    return markdownText ? marked.parser(marked.lexer(markdownText)) : '';
  }

  /**
   * Recebe um texto, markdown ou não, e devolve um texto sem as marcações
   *
   * @param {string} markdownText
   * @returns {string}
   * @memberof FormatadorDeTextoService
   */
  limpaMarkdown(markdownText: string): string {
    if (!markdownText) {
      return '';
    }

    const htmlText: string = this.markdownToHtml(markdownText);

    return this.limpaHtml(htmlText);
  }

  /**
   * Recebe um texto html e devolve um texto sem as marcações
   *
   * @param {string} htmlText
   * @returns {string}
   * @memberof FormatadorDeTextoService
   */
  limpaHtml(htmlText: string): string {
    if (!htmlText) {
      return '';
    }

    const span = this._document.createElement('span');
    span.innerHTML = htmlText;
    return span.textContent || span.innerText;
  }
}
