import {Injectable} from '@angular/core';

import {MatSnackBar} from '@angular/material';

import {select, Store} from '@ngrx/store';
import * as fromStore from '../../../store';

import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

import {
  Evento,
  SubTipoEvento,
  TipoEvento,
  Tutor,
  Tutoria,
  Unidade,
  Visibilidade,
} from '@model-objects';
import {ImodbService} from '../../model/servicos/imodb.service';

export enum OcorrenciaFormularioComponentTipo {
  TUTORIA = 'TUTORIA',
  OCORRENCIA_COMUM = 'OCORRENCIA_COMUM',
}

export interface OcorrenciaFormularioComponentData {
  id?: string;
  tutoria: Tutoria;
  unidade: Unidade;
  titulo: '';
  tipoEvento: TipoEvento;
  subTipoEvento: SubTipoEvento;
  dataEvento: Date;
  parecer: string;
  local: string;
  isResolvido: boolean;
  visibilidade: Visibilidade;
}

export class TutoriaNome {
  tutoria: Tutoria;
  nome: string;

  constructor(tutoria: Tutoria) {
    this.tutoria = tutoria;
    if (tutoria.turmas !== null && tutoria.turmas !== undefined &&
        tutoria.turmas.length > 0) {
      this.nome = '<span style="font-size: 9px;">';
      const comprimento = this.nome.length;
      for (const turma of tutoria.turmas) {
        this.nome += this.nome.length > comprimento ? '<br>' : '';
        this.nome += '<strong>' + turma.periodo;
        this.nome += '°';
        this.nome += turma.grade;
        this.nome += ' ' + turma.cursoNome.toUpperCase() + '</strong>';
      }
      this.nome += '</span>';
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaFormularioComponentService {
  constructor(private _matSnackbar: MatSnackBar, private _store$: Store<{}>,
              public _imodb: ImodbService) {}

  copiaFormularioParaObjeto(ocorrencia: Evento, formulario: any): Evento {
    if (!ocorrencia) {
      ocorrencia = new Evento();
    }

    // coleta tutoria...
    const tutoria: Tutoria = formulario.tutoriaEscolhida ?
                                 (formulario.tutoriaEscolhida as Tutoria) :
                                 null;
    if (!tutoria) {
      const message = 'Não é possível gravar uma ocorrência sem uma turma';
      this._matSnackbar.open(message, 'ERRO', {duration: 7000});
      throw new Error(message);
    }
    ocorrencia.tutoria = tutoria;

    // coleta o tipo...
    const tipoEvento: TipoEvento =
        formulario.tipoEscolhido ? (formulario.tipoEscolhido as TipoEvento) :
                                   null;
    if (!tipoEvento || !tipoEvento.descricao) {
      const message =
          'Não é possível gravar uma ocorrência sem um tipo/subtipo';
      this._matSnackbar.open(message, 'ERRO', {duration: 7000});
      throw new Error(message);
    }
    ocorrencia.descricaoTipoEvento = tipoEvento.descricao;

    // coleta o subtipo...
    const subTipoEvento: SubTipoEvento =
        formulario.subTipoEscolhido ?
            (formulario.subTipoEscolhido as SubTipoEvento) :
            null;
    if (!subTipoEvento || !subTipoEvento.descricao) {
      const message =
          'Não é possível gravar uma ocorrência sem um tipo/subtipo';
      this._matSnackbar.open(message, 'ERRO', {duration: 7000});
      throw new Error(message);
    }
    ocorrencia.descricaoSubTipoEvento = subTipoEvento.descricao;

    // coleta data...
    const dataEvento: Date =
        formulario.dataEvento ? new Date(formulario.dataEvento) : null;
    if (!dataEvento) {
      const message = 'Não é possível gravar uma ocorrência sem indicar a data';
      this._matSnackbar.open(message, 'ERRO', {duration: 7000});
      throw new Error(message);
    }
    ocorrencia.data = dataEvento;

    if (!ocorrencia.id) {
    }

    return ocorrencia;
  }

  /** tipos de evento disponíveis */
  getTutoriasNomes$(): Observable<TutoriaNome[]> {
    return this._store$.pipe(
        select(fromStore.GERAL.SELECTORS.TUTORIA.getTutorias),
        tap((tutorias: Tutoria[]) => this._ordenaTutorias(tutorias)),
        map((tutorias: Tutoria[]) => this.arrumaTutoriaNomes(tutorias)));
  }

  /** tipos de evento disponíveis */
  getTiposDisponiveis$(): Observable<TipoEvento[]> {
    return this._store$.pipe(
        select(fromStore.GERAL.SELECTORS.TIPO_EVENTO.getTipoEventos));
  }

  /** ordena as tutorias */
  private _ordenaTutorias(tutoriasDisponiveis: Tutoria[]) {
    tutoriasDisponiveis.sort((a: Tutoria, b: Tutoria) => {
      const aTutor: Tutor[] =
          a.historicoTutores.filter((a1: Tutor) => !a1.dataFim);
      const bTutor: Tutor[] =
          b.historicoTutores.filter((b1: Tutor) => !b1.dataFim);

      if (aTutor.length === 0) {
        a.historicoTutores.sort(
            (a1: Tutor, b1: Tutor) =>
                a1.nomeTutor.toUpperCase() === b1.nomeTutor.toUpperCase() ?
                    0 :
                    a1.nomeTutor.toUpperCase() < b1.nomeTutor.toUpperCase() ?
                    -1 :
                    1);
        aTutor.push(a.historicoTutores[0]);
      }

      if (bTutor.length === 0) {
        b.historicoTutores.sort(
            (a1: Tutor, b1: Tutor) =>
                a1.nomeTutor.toUpperCase() === b1.nomeTutor.toUpperCase() ?
                    0 :
                    a1.nomeTutor.toUpperCase() < b1.nomeTutor.toUpperCase() ?
                    -1 :
                    1);
        bTutor.push(b.historicoTutores[0]);
      }

      const aNome = aTutor[0].nomeTutor.toUpperCase().trim();
      const bNome = bTutor[0].nomeTutor.toUpperCase().trim();

      return aNome === bNome ? 0 : aNome < bNome ? -1 : 1;
    });
  }

  /** cria um array de tutorias nomes e o retorna */
  arrumaTutoriaNomes(tutorias: Tutoria[]): TutoriaNome[] {
    const tutoriasNomes: TutoriaNome[] = [];
    for (const tut of tutorias) {
      if (tut.turmas !== null && tut.turmas !== undefined) {
        if (tut.turmas.length > 0) {
          const novo: TutoriaNome = new TutoriaNome(tut);
          tutoriasNomes.push(novo);
        }
      }
    }

    tutoriasNomes.sort(
        (a: TutoriaNome, b: TutoriaNome) =>
            a.nome.toUpperCase() === b.nome.toUpperCase() ?
                0 :
                a.nome.toUpperCase() < b.nome.toUpperCase() ? -1 : 1);

    return tutoriasNomes;
  }
}
