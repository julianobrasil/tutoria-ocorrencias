import {Injectable} from '@angular/core';

import {
  Config,
  DadosApp,
  DataDeEntrega,
  Funcao,
  Permissao,
  TipoEvento,
  Tutoria,
  Unidade,
  UsuarioAD,
  ValorTutoria,
} from '../transport-objects/';

@Injectable()
export class ImodbService {
  apps: DadosApp[];
  unidades: Unidade[];
  usuarios: UsuarioAD[];
  funcoes: Funcao[];
  permissoes: Permissao[];
  tipos: TipoEvento[];
  tutorias: Tutoria[];
  config: Config;
  datasDeEntrega: DataDeEntrega[];
  valoresTutoria: ValorTutoria[];
  diffHoraLocalServidorMilliSeconds: number;

  constructor() {
    this.datasDeEntrega = [];
    this.unidades = [];
    this.usuarios = [];
    this.funcoes = [];
    this.permissoes = [];
    this.config = null;
    this.datasDeEntrega = null;
    this.tipos = [];
    this.valoresTutoria = [];
  }
}
