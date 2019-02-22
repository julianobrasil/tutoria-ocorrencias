import {Evento} from './evento';
export class EventoPaginado {
  public content: Evento[];
  public totalPages: number;
  public totalElements: number;
  public last: boolean;
  public size: number;
  public number: number;
  public sort: string;
  public numberOfElements: number;
  public first: boolean;

  constructor() {
    this.content = [];
  }
}

EventoPaginado['__class'] = 'EventoPaginado';
