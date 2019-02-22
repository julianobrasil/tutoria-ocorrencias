import {Tutoria} from './tutoria';
export class TutoriaPaginada {
  public content: Tutoria[];
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

TutoriaPaginada['__class'] = 'TutoriaPaginada';
