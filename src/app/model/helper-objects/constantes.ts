import * as URL from './rest-url';
export class Permissoes {
  public static REGISTRO_TUTORIA_CONSULTAR = 'REGISTRO_ TUTORIA_CONSULTAR';
  public static REGISTRO_TUTORIA_ALTERAR = 'REGISTRO_TUTORIA_ALTERAR';
  public static REGISTRO_TUTORIA_VISUALIZAR = 'REGISTRO_TUTORIA_VISUALIZAR';
  public static ANDAMENTO_TUTORIA_VISUALIZAR = 'ANDAMENTO_TUTOTIRA_VISUALIZAR';
  public static ANDAMENTO_TUTORIA_CONSULTAR = 'ANDAMENTO_TUTORIA_CONSULTAR';
  public static PARECER_TUTORIA_CONSULTAR = 'PARECER_TUTORIA_CONSULTAR';
  public static PARECER_TUTORIA_VISUALIZAR = 'PARECER_TUTORIA_VISUALIZAR';
  public static PARECER_TUTORIA_ALTERAR = 'PARECER_TUTORIA_ALTERAR';
  public static CADASTRO_TUTORIA_ALTERAR = 'CADASTRO_TUTORIA_ALTERAR';
  public static CADASTRO_TUTORIA_VISUALIZAR = 'CADASTRO_TUTORIA_VISUALIZAR';
  public static CADASTRO_TUTORIA_CONSULTAR = 'CADASTRO_TUTORIA_CONSULTAR';
  public static CADASTRO_USUARIO_ALTERAR = 'CADASTRO_USUARIO_ALTERAR';
  public static CADASTRO_USUARIO_VISUALIZAR = 'CADASTRO_USUARIO_VISUALIZAR';
  public static CADASTRO_USUARIO_CONSULTAR = 'CADASTRO_USUARIO_CONSULTAR';
  public static CADASTRO_AREAS_ALTERAR = 'CADASTRO_AREAS_ALTERAR';
  public static CADASTRO_AREAS_VISUALIZAR = 'CADASTRO_AREAS_VISUALIZAR';
  public static CADASTRO_AREAS_CONSULTAR = 'CADASTRO_AREAS_CONSULTAR';
  public static CADASTRO_CONFIG_ALTERAR = 'CONFIG_ALTERAR';
  public static CADASTRO_CONFIG_VISUALIZAR = 'CONFIG_VISUALIZAR';
  public static CADASTRO_CONFIG_CONSULTAR = 'CONFIG_CONSULTAR';
  public static RELATORIO_ALTERAR = 'RELATORIO_ALTERAR';
  public static RELATORIO_VISUALIZAR = 'RELATORIO_VISUALIZAR';
  public static RELATORIO_CONSULTAR = 'RELATORIO_CONSULTAR';
  public static RELATORIO_TUTORIAS_ALTERAR = 'RELATORIO_TUTORIAS_ALTERAR';
  public static RELATORIO_TUTORIAS_VISUALIZAR = 'RELATORIO_TUTORIAS_VISUALIZAR';
  public static RELATORIO_TUTORIAS_CONSULTAR = 'RELATORIO_TUTORIAS_CONSULTAR';
  public static RELATORIO_REPRESENTANTES_ALTERAR = 'RELATORIO_REPRESENTANTES_ALTERAR';
  public static RELATORIO_REPRESENTANTES_VISUALIZAR = 'RELATORIO_REPRESENTANTES_VISUALIZAR';
  public static RELATORIO_REPRESENTANTES_CONSULTAR = 'RELATORIO_REPRESENTANTES_CONSULTAR';
  public static REPRESENTANTE_TURMA_CONSULTAR = 'REPRESENTANTE_TURMA_CONSULTAR';
  public static REPRESENTANTE_TURMA_ALTERAR = 'REPRESENTANTE_TURMA_ALTERAR';
  public static REPRESENTANTE_TURMA_VISUALIZAR = 'REPRESENTANTE_TURMA_VISUALIZAR';
  public static ADMINISTRACAO_SISTEMA = 'ADMINISTRACAO_SISTEMA';
}

// tslint:disable-next-line:max-classes-per-file
export class Messages {
  public static CUTUCADA_SUCESSO = 'Você cutucou';
  public static CUTUCADA_ERRO = 'Não foi possível cutucar';
  public static DATA_DE_ENTREGA_SALVA_SUCESSO = 'Data de entrega registrada com sucesso!';
  public static DATA_DE_ENTREGA_SALVA_ERRO = 'Não foi possível registrar a data de entrega!';
  public static DATA_DE_ENTREGA_EXCLUIDA_SUCESSO = 'Data de entrega excluída com sucesso!';
  public static DATA_DE_ENTREGA_EXCLUIDA_ERRO = 'Não foi possível excluir a data de entrega!';
  public static DATA_DE_ENTREGA_JA_EXISTENTE = 'A data de entrega já estava cadastrada';
  public static FUNCAO_SALVA_SUCESSO = 'Função atribuída com sucesso!';
  public static FUNCAO_SALVA_ERRO = 'Não foi possível atribuir a função!';
  public static FUNCAO_EXCLUIDA_SUCESSO = 'Função retirada com sucesso!';
  public static FUNCAO_EXCLUIDA_ERRO = 'Não foi possível retirar a função do usuário!';
  public static FUNCAO_JA_EXISTENTE = 'O usuário escolhido já possui essa função';
  public static PERMISSAO_SALVA_SUCESSO = 'Permissão atribuída com sucesso!';
  public static PERMISSAO_SALVA_ERRO = 'Não foi possível atribuir a permissão!';
  public static PERMISSAO_EXCLUIDA_SUCESSO = 'Permissão retirada com sucesso!';
  public static PERMISSAO_EXCLUIDA_ERRO = 'Não foi possível retirar a permissão do usuário!';
  public static PERMISSAO_JA_EXISTENTE = 'O usuário escolhido já possui essa permissão';
  public static RESPONSABILIDADE_SALVA_SUCESSO = 'Responsabilidade atribuída com sucesso!';
  public static RESPONSABILIDADE_SALVA_ERRO = 'Não foi possível atribuir a responsabilidade!';
  public static RESPONSABILIDADE_EXCLUIDA_SUCESSO = 'Responsabilidade retirada com sucesso!';
  // tslint:disable-next-line:max-line-length
  public static RESPONSABILIDADE_EXCLUIDA_ERRO = 'Não foi possível retirar a responsabilidade do usuário!';
  public static RESPONSABILIDADE_JA_EXISTENTE = 'O usuário já é responsável por esse subtipo';
  public static SUBTIPO_JA_EXISTENTE = 'O tipo/subtipo escolhido já existe';
  public static TIPO_SALVO_SUCESSO = 'Tipo salvo com sucesso!';
  public static TIPO_SALVO_ERRO = 'Não foi possível salvar o tipo!';
  public static TIPO_EXCLUIDO_SUCESSO = 'Tipo excluído com sucesso!';
  public static TIPO_EXCLUIDO_ERRO = 'Não foi possível excluir o tipo!';
  public static TUTORIA_SALVA_SUCESSO = 'Tutoria salva com sucesso!';
  public static TUTORIA_SALVA_ERRO = 'Não foi possível salvar a tutoria!';
  public static TUTORIA_EXCLUIDA_SUCESSO = 'Tutoria excluída com sucesso!';
  public static TUTORIA_EXCLUIDA_ERRO = 'Não foi possível excluir a tutoria!';
  public static OCORRENCIA_SALVA_SUCESSO = 'Ocorrência registrada com sucesso!';
  public static OCORRENCIA_SALVA_ERRO = 'Não foi possível registrar a ocorrência!';
  public static OCORRENCIA_EXCLUIDA_SUCESSO = 'Ocorrência excluída com sucesso!';
  public static OCORRENCIA_EXCLUIDA_ERRO = 'Não foi possível excluir a ocorrência!';
  public static PARECER_SALVO_SUCESSO = 'Parecer registrado com sucesso!';
  public static PARECER_SALVO_ERRO = 'Não foi possível registrar o parecer!';
  public static PARECER_EXCLUIDO_SUCESSO = 'Parecer excluído com sucesso!';
  public static PARECER_EXCLUIDO_ERRO = 'Não foi possível excluir o parecer!';
  public static SEMESTRE_DE_TRABALHO_SALVO_SUCESSO = 'Semestre de trabalho trocado com sucesso!';
  public static SEMESTRE_DE_TRABALHO_SALVO_ERRO = 'Não foi possível trocar o semestre de trabalho!';
  // tslint:disable-next-line:max-line-length
  public static SOLICITACAO_DE_DETALHES_ENVIADA_SUCESSO = 'Solicitaçao de mais detalhes enviada com sucesso';
  // tslint:disable-next-line:max-line-length
  public static SOLICITACAO_DE_DETALHES_ENVIADA_ERRO = 'Desculpe, não foi possível enviar a solicitação';
  public static TUTORIA_VALOR_SALVO_SUCESSO = 'Valor da tutoria alterado com sucesso!';
  public static TUTORIA_VALOR_SALVO_ERRO = 'Não foi possível alterar o valor da tutoria!';
  public static USUARIO_SALVO_SUCESSO = 'Usuario alterado com sucesso!';
  public static USUARIO_SALVO_ERRO = 'Não foi possível alterar o usuário!';
  public static RELATORIO_SOLICITADO_SUCESSO = 'O relatório foi gerado com sucesso!';
  public static RELATORIO_SOLICITADO_ERRO = 'Não foi possível gerar o relatório!';
}

// tslint:disable-next-line:max-classes-per-file
export class NomesDeArquivos {
  public static RELATORIO_TUTORIAS_EXCEL_DOWNLOAD_NOME = 'relatorio_de_tutorias.xlsx';
  public static RELATORIO_REPRESENTANTES_EXCEL_DOWNLOAD_NOME = 'relatorio_de_representantes.xlsx';
  // tslint:disable-next-line:max-line-length
  public static RELATORIO_ATIVIDADES_EXCEL_DOWNLOAD_NOME = 'relatorio_de_atividades_de_tutorias.xlsx';
  // tslint:disable-next-line:max-line-length
  public static RELATORIO_DETALHADO_POR_SEMESTRE_EXCEL_DOWNLOAD_NOME = 'relatorio_de_atividades_detalhado_por_semestre.xlsx';
}

// tslint:disable-next-line:max-classes-per-file
export class Gerais {
  public static SNACKBAR_TIME = 6000;
  public static STRING_CHAVE_EMBARALHAMENTO = 'the quick brown fox jumps over the lazy dog';
}

export {URL};

export const APP_ID = 'TUTORIA_BACKEND_MAIN_ID';
