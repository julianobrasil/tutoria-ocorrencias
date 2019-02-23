import {CentroDeCusto} from './centro-de-custo';
import {RepresentanteTurmaTutoria} from './representante-turma-tutoria';
export class Turma {
  public grade = '';
  public periodo = '';
  public cursoNome = '';
  public representantesTurmaTutoria: RepresentanteTurmaTutoria[];
  public centroDeCusto: CentroDeCusto;

  constructor() {
    this.representantesTurmaTutoria = [];
    this.centroDeCusto = new CentroDeCusto();
  }
}
Turma['__class'] = 'Turma';
