import {Responsavel} from './responsavel';

export class SubTipoEvento {
  public nomeSubTipoEvento = '';
  public descricao = '';
  public isNovo?: boolean;
  public emaiResponsavelParaExclusao?: string;
  public responsaveis: Responsavel[];

  constructor() {
    this.responsaveis = [];
    this.isNovo = false;
    this.emaiResponsavelParaExclusao = '';
  }
}
SubTipoEvento['__class'] = 'SubTipoEvento';
