import {AbstractDocument} from './abstract-document';
import {SemestreDeTrabalho} from './semestre-de-trabalho';
export class DataDeEntrega extends AbstractDocument {
  public unidade = '';
  public datas: Date[];
  public semestreDeTrabalho: SemestreDeTrabalho;

  constructor() {
    super();
    this.datas = [];
    this.semestreDeTrabalho = new SemestreDeTrabalho();
  }
}

DataDeEntrega['__class'] = 'DataDeEntrega';
