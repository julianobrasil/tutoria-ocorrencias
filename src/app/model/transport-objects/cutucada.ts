import {Etapa} from './etapa';
import {Evento} from './evento';

export class Cutucada {
  public evento: Evento;
  public etapa: Etapa;
  public emailCutucante = '';
  public emailCutucado = '';

  constructor() {
    this.evento = new Evento();
    this.etapa = new Etapa();
  }
}
Cutucada['__class'] = 'Cutucada';
