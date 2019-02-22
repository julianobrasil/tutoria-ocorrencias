import {AbstractDocument} from './abstract-document';

export class CentroDeCusto extends AbstractDocument {
  public nomeCentroDeCusto = '';
  public codigo = '';
  public nomeCurso = '';
  public codigoCurso = 0;
  public unidade = '';
  public turno = '';

  constructor() {
    super();
  }
}
CentroDeCusto['__class'] = 'CentroDeCusto';
