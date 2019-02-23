import {AbstractDocument} from './abstract-document';
import {SemestreDeTrabalho} from './semestre-de-trabalho';
export class Config extends AbstractDocument {
  public semestreDeTrabalho: SemestreDeTrabalho;

  constructor() {
    super();
    this.semestreDeTrabalho = new SemestreDeTrabalho();
  }
}
Config['__class'] = 'Config';
