import {Responsavel} from './responsavel';

export class SubTipoEvento {
  public nomeSubTipoEvento = '';
  public descricao = '';
  public isNovo = false;
  public emaiResponsavelParaExclusao = '';
  public responsaveis: Responsavel[];

  constructor() {
    this.responsaveis = [];
  }
}
SubTipoEvento['__class'] = 'SubTipoEvento';
