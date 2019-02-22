import {Unidade} from './unidade';
export class RelatorioConsultaTutoriasWrapperDTO {
  unidadeDTOs: Unidade[];
  nomeCurso = '';
  emailTutor = '';
  tipo = '';
  notificaEleicaoDeRepresentantes = false;
  isUsaDataAtividadeInicioParaTodos = false;
  isUsaDataAtividadeFimParaTodos = false;
  dataAtividadeInicio = new Date();
  dataAtividadeFim = new Date();
  turnos: string[];

  constructor() {
    this.unidadeDTOs = [];
    this.turnos = [];
  }
}

RelatorioConsultaTutoriasWrapperDTO['__class'] = 'RelatorioConsultaTutoriasWrapperDTO';
