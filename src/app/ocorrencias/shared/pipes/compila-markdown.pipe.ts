import {Pipe, PipeTransform} from '@angular/core';

import {FormatadorDeTextoService} from '../utilitarios/formatador-de-texto.service';

@Pipe({
  name: 'compilaMarkdown',
})
export class CompilaMarkdownPipe implements PipeTransform {
  constructor(private _formatadorDeTextoService: FormatadorDeTextoService) {}

  transform(value: string): string {
    return this._formatadorDeTextoService.markdownToHtml(value);
  }
}
