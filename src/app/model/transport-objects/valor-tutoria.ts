import {AbstractDocument} from './abstract-document';
import {SemestreDeTrabalho} from './semestre-de-trabalho';
export class ValorTutoria extends AbstractDocument {
  public valor = 0;
  public unidade = '';
  public semestreDeTrabalho: SemestreDeTrabalho;

  constructor() {
    super();

    this.semestreDeTrabalho = new SemestreDeTrabalho();
  }
}

ValorTutoria['class__'] = 'ValorTutoria';
