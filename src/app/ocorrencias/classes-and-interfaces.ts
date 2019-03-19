import {ObjectReference, RotuloDoEvento} from '@model-objects';
import {
  TipoSubtipoInfo,
} from './shared/componentes/selecao-de-tipos-de-ocorrencias/tipos-de-ocorrencia-service-adapter';

export interface IssueTrackerPagination {
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalElements?: number;
}

export class FiltrosDeBusca {
  autorRef?: ObjectReference;
  cursosRef?: ObjectReference[];
  responsaveisRef?: ObjectReference[];
  rotulos?: RotuloDoEvento[];
  rotulosAplicativos?: RotuloDoEvento[];
  rotulosAplicativosIds?: string[];
  rotulosIds?: string[];
  tiposDeOcorrenciasInfo?: TipoSubtipoInfo[];
  isAberta?: boolean;
  isFechada?: boolean;

  constructor() {
    this.autorRef = null;
    this.cursosRef = [];
    this.responsaveisRef = [];
    this.rotulos = [];
    this.rotulosAplicativos = [];
    this.rotulosAplicativosIds = [];
    this.rotulosIds = [];
    this.tiposDeOcorrenciasInfo = [];
    this.isAberta = true;
    this.isFechada = false;
  }
}
