import {Evento} from '../../transport-objects/evento';
import {Turma} from '../../transport-objects/turma';
import {Tutoria} from '../../transport-objects/tutoria';

export class TutoriaNome {
  public tutoria: Tutoria;
  public nome: string;

  constructor(tutoria: Tutoria) {
    this.tutoria = tutoria;
    if (tutoria.turmas !== null && tutoria.turmas !== undefined && tutoria.turmas.length > 0) {
      this.nome = '<span style="font-size: 9px;">';
      const comprimento = this.nome.length;
      for (const turma of tutoria.turmas) {
        this.nome += this.nome.length > comprimento ? '<br>' : '';
        this.nome += '<strong>' + turma.periodo;
        this.nome += '°';
        this.nome += turma.grade;
        this.nome += ' ' + turma.cursoNome.toUpperCase() + '</strong>';
        // this.nome += ' ' + tutoria.turno;
        // this.nome += ' ' + tutoria.unidade.cidade + ':' + tutoria.unidade.unidade;
      }
      this.nome += '</span>';
    }
    // console.log(this.nome);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class EventoParaTabela {
  public id: string;
  public data: string;
  public evento: Evento;
  public tutoria: Tutoria;
  public nomeTurmas: string;

  constructor(tutoria: Tutoria) {
    this.tutoria = tutoria;

    if (tutoria.turmas.length > 0) {
      this.tutoria.turmas.sort(
        (a: Turma, b: Turma) =>
          a.cursoNome.toUpperCase() === b.cursoNome.toUpperCase()
            ? a.periodo === b.periodo
              ? a.grade.toUpperCase() === b.grade.toUpperCase()
                ? 0
                : a.grade.toUpperCase() < b.grade.toUpperCase()
                  ? -1
                  : 1
              : a.periodo < b.periodo
                ? -1
                : 1
            : a.cursoNome.toUpperCase() < b.cursoNome.toUpperCase()
              ? -1
              : 1,
      );
    }

    this.nomeTurmas = this.turmasToString();
  }

  private turmasToString(): string {
    let str = '';
    if (this.tutoria.turmas !== null && this.tutoria.turmas !== undefined) {
      if (this.tutoria.turmas.length > 0) {
        str =
          this.tutoria.turno.toUpperCase() +
          ':' +
          this.tutoria.unidade.cidade.toUpperCase() +
          ':' +
          this.tutoria.unidade.unidade.toUpperCase() +
          '<br>';
        const comp = str.length;
        for (const turma of this.tutoria.turmas) {
          str += str.length === comp ? '' : '<br>';
          str += '.' + turma.periodo + '°';
          str += turma.grade.toUpperCase();
          str += ' ' + turma.cursoNome.toUpperCase();
          str += ':' + turma.centroDeCusto.unidade.toUpperCase();
        }
      }
    }

    return str;
  }
}
