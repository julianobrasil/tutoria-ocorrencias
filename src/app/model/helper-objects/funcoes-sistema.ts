class ModeloFuncao {
  constructor(public funcao: string, public funcaoSistema: string, public ocupante: string) {}
}

// tslint:disable-next-line:max-classes-per-file
export class Funcoes {
  public static COORDENACAO: ModeloFuncao = new ModeloFuncao(
    'COORDENAÇÃO',
    'COORDENADOR',
    'COORDENADOR',
  );
  public static QUALIDADE: ModeloFuncao = new ModeloFuncao(
    'GERÊNCIA DE QUALIDADE',
    'QUALIDADE',
    'GERENTE DE QUALIDADE',
  );
  public static DIRETOR: ModeloFuncao = new ModeloFuncao('DIRETORIA', 'DIRETORIA', 'DIRETOR');
  public static RESPONSAVEL: ModeloFuncao = new ModeloFuncao(
    'EXECUÇÃO DE SERVIÇO',
    'RESPONSAVEL',
    'RESPONSÁVEL POR EXECUÇÃO',
  );
  public static TUTOR: ModeloFuncao = new ModeloFuncao('TUTORIA', 'TUTOR', 'TUTOR DE TURMA');
  public static ADMINISTRADOR: ModeloFuncao = new ModeloFuncao(
    'ADMINISTRAÇÃO',
    'ADMINISTRADOR',
    'ADMINISTRAÇÃO DO SISTEMA',
  );
  public static OPERACOES: ModeloFuncao = new ModeloFuncao(
    'GERÊNCIA DE OPERAÇÕES',
    'OPERACOES',
    'GERENTE DE OPERAÇÕES',
  );
  public static CONVIDADO: ModeloFuncao = new ModeloFuncao(
    'CONVIDADO',
    'CONVIDADO',
    'CONVIDADO',
  );
}

export const funcoesObj = {
  COORDENADOR: Funcoes.COORDENACAO,
  QUALIDADE: Funcoes.QUALIDADE,
  DIRETORIA: Funcoes.DIRETOR,
  RESPONSAVEL: Funcoes.RESPONSAVEL,
  TUTOR: Funcoes.TUTOR,
  ADMINISTRADOR: Funcoes.ADMINISTRADOR,
  OPERACOES: Funcoes.OPERACOES,
};

/** TODO(@julianobrasil): ADICIONADO => DAQUI PRA BAIXO */
export interface PermissaoDoUsuario {
  appID: string;
  unidade: string;
  permissoes: string;
}

export interface FuncaoDoUsuario {
  appID: string;
  unidade: string;
  funcoes: string;
}
