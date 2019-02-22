import {Injectable} from '@angular/core';

import {
  Config,
  DadosApp,
  DataDeEntrega,
  Funcao,
  Permissao,
  SubTipoEvento,
  TipoEvento,
  Tutoria,
  Unidade,
  Usuario,
  UsuarioAD,
  ValorTutoria,
} from '../transport-objects/to';

@Injectable()
export class ImodbService {
  public apps: DadosApp[];
  public unidades: Unidade[];
  public usuarios: UsuarioAD[];
  public funcoes: Funcao[];
  public permissoes: Permissao[];
  public tipos: TipoEvento[];
  public tutorias: Tutoria[];
  public config: Config;
  public datasDeEntrega: DataDeEntrega[];
  public valoresTutoria: ValorTutoria[];
  public diffHoraLocalServidorMilliSeconds: number;

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
