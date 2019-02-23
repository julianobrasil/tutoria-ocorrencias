import {AbstractDocument} from './abstract-document';
import {Coordenador} from './coordenador';
import {SemestreDeTrabalho} from './semestre-de-trabalho';
import {Turma} from './turma';
import {Tutor} from './tutor';
import {Unidade} from './unidade';

export class Tutoria extends AbstractDocument {
  public unidade: Unidade;
  public turno = '';
  public semestreDeTrabalho: SemestreDeTrabalho;
  public isNaoRemunerada?: boolean;
  public historicoTutores: Tutor[];
  public coordenadores: Coordenador[];
  public turmas: Turma[];

  constructor() {
    super();
    this.coordenadores = [];
    this.turmas = [];
    this.historicoTutores = [];
    this.semestreDeTrabalho = new SemestreDeTrabalho();
    this.isNaoRemunerada = false;
    this.unidade = new Unidade();
  }
}
Tutoria['__class'] = 'Tutoria';
