import {AbstractDocument} from './abstract-document';
import {SubTipoEvento} from './sub-tipo-evento';
export class TipoEvento extends AbstractDocument {
  public nomeTipoEvento = '';
  public descricao = '';
  public listaSubTipoEvento: SubTipoEvento[];
  public unidade = '';

  constructor() {
    super();
    this.listaSubTipoEvento = [];
  }
}

TipoEvento['__class'] = 'TipoEvento';
