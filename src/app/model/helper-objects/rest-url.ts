export const authorizationHeaderKey = 'Authorization';
export const httpContenTypeKey = 'Content-Type';
export const httpContenTypeJsonValue = 'application/json';

export const baseURL = 'http://sistemas.com';
export const baseTutoriaServiceURL = baseURL + '/tutoriaservice';
export const baseUserServiceURL = baseURL + '/user';
export const logoutAuthURL = 'http://authserver.com/uaa/logout';
export const logoutAuthOldBrowsers_1st_LoginLogout_GET = 'http://authserver.com/uaa/login?logout';
export const logoutAuthOldBrowsers_2nd_Login_GET = 'http://authserver.com/uaa/login';
export const logoutGatewayURL = baseURL + '/logout';
export const loginURL = baseURL + '/tutoria';
// export const baseTutoriaServiceURL = 'http://tutoriaservice.alfa.br:8090'; // servidor da ALFA
// export const baseTutoriaServiceURL = 'https://mighty-anchorage-26575.herokuapp.com';

export const funcoesTodasPath = '/api/funcao';

export const centroDeCustosPorNomeDoCurso = '/api/centro-de-custo/busca-por-nome-curso';
export const centroDeCustosPorNomeDoCursoKey = 'parte';

export const configSalvarPath = '/api/config/create';
export const configUnicaPath = '/api/config';

export const dataDeEntregaSalvarPath = '/api/data-de-entrega/create';
export const dataDeEntregaBySemestreDeTrabalhoPOSTPath =
  '/api/data-de-entrega/busca-por-semestre-de-trabalho';
// export const dataDeEntregaBySemestreDeTrabalhoKey = 'semestreDeTrabalho';
export const dataDeEntregaRemoverPath = '/api/data-de-entrega/remover/';

export const dataEHoraServicePath = '/api/date-time';

export const eventoByEmailTutorAtivoPath = '/api/evento/list-by-email-tutor-ativo';
export const eventoByEmailTutorAtivoKey1_email = 'email';
export const eventoByEmailTutorAtivoKey2_page = 'page';
export const eventoByEmailTutorAtivoKey3_size = 'size';
export const eventoByTutorTipoSubtipoCursoResolvidoPath = '/api/evento/busca-andamento-any';
export const eventoByTutorTipoSubtipoCursoResolvidoKey1_any = 'any';
export const eventoByTutorTipoSubtipoCursoResolvidoKey2_resovido = 'resolvido';
export const eventoByTutorTipoSubtipoCursoResolvidoKey3_page = 'page';
export const eventoByTutorTipoSubtipoCursoResolvidoKey4_size = 'size';
export const eventoByPareceristaLogadoPath = '/api/evento/busca-parecer';
export const eventoByPareceristaLogadoKey1_page = 'page';
export const eventoByPareceristaLogadoKey2_size = 'size';
export const eventoCutucaPath = '/api/evento/cutuca';
export const eventoPath = '/api/evento/';
export const eventoRemoverPath = '/api/evento/remover/';
export const eventoSalvarPath = '/api/evento/create';
export const eventoSolicitacaoDetalhesPath = '/api/evento/solicita-detalhes';

export const permissoesUsuarioAutenticadoPath = '/api/permissao/autenticado';
export const permissoesTodasPath = '/api/permissao';

export const relatorioAtividadesTutoriasPOSTPath = '/api/relatorio/relatorio-atividades-tutorias';
export const relatorioRepresentantesTodosPath = '/api/relatorio/relatorio-de-representantes';
export const relatorioRepresentantesTodosKey1_notificaEleicaoRepresentantes =
  'notificaEleicaoRepresentantes';
export const relatorioRepresentantesEspecificoPOSTPath =
  '/api/relatorio/relatorio-de-representantes-especifico';
export const relatorioAtividadesDetalhadoPorSemestrePOSTPath =
  '/api/relatorio/relatorio-de-atividades-detalhado-por-semestre';
export const relatorioTutoriasTodosPath = '/api/relatorio/relatorio-de-tutorias';
export const relatorioTutoriasEspecificoPOSTPath =
  '/api/relatorio/relatorio-de-tutorias-especifico';

export const tipoEventoByEmailPath = '/api/tipo-evento/busca-por-email';
export const tipoEventoByEmailKey1_emailResponsavel = 'emailResponsavel';
export const tipoEventoByEmailKey2_cidade = 'cidade';
export const tipoEventoByEmailKey3_unidade = 'unidade';
export const tipoEventoPorId = '/api/tipo-evento/';
export const tipoEventoSalvarPath = '/api/tipo-evento/create';
export const tipoEventoTodosPath = '/api/tipo-evento';
export const tipoEventoRemoverPath = '/api/tipo-evento/remover/';

export const tutoriaByPareceristaLogadoPath = '/api/tutoria/busca-parecer';
export const tutoriaByEmailTutorOuCoordenadorPath = '/api/tutoria/list-by-email';
export const tutoriaByEmailTutorOuCoordenadorKey1_email = 'email';
export const tutoriaByEmailTutorOuCoordenadorKey2_nomeOuEmail = 'nomeOuEmail';
export const tutoriaByEmailTutorOuCoordenadorKey3_page = 'page';
export const tutoriaByEmailTutorOuCoordenadorKey4_size = 'size';
export const tutoriaByEmailTutorOuCoordenadorOuCursoPath = '/api/tutoria/list-by-email-ou-curso';
export const tutoriaByEmailTutorOuCoordenadorOuCursoKey1_email = 'email';
export const tutoriaByEmailTutorOuCoordenadorOuCursoKey2_nomeOuEmail = 'nomeOuEmailOuCurso';
export const tutoriaByEmailTutorOuCoordenadorOuCursoKey3_page = 'page';
export const tutoriaByEmailTutorOuCoordenadorOuCursoKey4_size = 'size';
export const tutoriaByEmailTutorAtivoPath = '/api/tutoria/list-by-email-tutor-ativo';
export const tutoriaByEmailTutorAtivoKey = 'email';
export const tutoriaPath = '/api/tutoria/';
export const tutoriaRemoverPath = '/api/tutoria/remover/';
export const tutoriaSalvarPath = '/api/tutoria/create';

export const unidadePath = '/api/unidade';

export const usuariosLikeNameOrEmailPath = '/api/usuario/busca-por-nome-ou-email';
export const usuariosByNameOrEmailKey = 'any';
export const usuarioByEmailPath = '/api/usuario/busca-por-email';
export const usuarioByEmailKey = 'email';

// traz dados do AD e token
export const usuarioLogadoPath = '';

// traz dados do banco no auth server (não é do AD)
export const usuarioSqlLogadoPath = '/api/usuario/usuario-logado';

export const usuariosLdapByNameOrEmailPath = '/busca-por-nome-ou-email-ad';
export const usuariosLdapByNameOrEmailKey = 'any';
export const usuarioLdapTodosPath = '/all-ad';
export const usuarioLdapByEmailPath = '/busca-por-email-ad';
export const usuarioLdapByEmailKey = 'email';

export const usuarioEFuncaoByNameOrEmailPath =
  '/api/usuario/usuario-funcao/busca-por-nome-ou-email';
export const usuarioEFuncaoByNameOrEmailKey1_any = 'any';
export const usuarioEFuncaoByNameOrEmailKey2_cidade = 'cidade';
export const usuarioEFuncaoByNameOrEmailKey3_unidade = 'unidade';
export const usuarioEFuncaoSalvaPath = '/api/usuario/usuario-funcao/create';
export const usuarioEFuncaoRemoverPath = '/api/usuario/usuario-funcao/remover/';
export const usuarioEPermissaoSalvaPath = '/api/usuario/usuario-permissao/create';
export const usuarioEPermissaoByNameOrEmailPath =
  '/api/usuario/usuario-permissao/busca-por-nome-ou-email';
export const usuarioEPermissaoByNameOrEmailKey1_any = 'any';
export const usuarioEPermissaoByNameOrEmailKey2_cidade = 'cidade';
export const usuarioEPermissaoByNameOrEmailKey3_unidade = 'unidade';
export const usuarioEPermissaoRemoverPath = '/api/usuario/usuario-permissao/remover/';
export const usuarioEsqueciMinhaSenhaPath = '/api/usuario/reset-password';
export const usuarioSalvarPath = '/api/usuario/create';
export const valorTutoriaSalvaPath = '/api/valor-tutoria/create';
export const valorTutoriaBySemestreDeTrabalhoPOSTPath =
  '/api/valor-tutoria/busca-por-semestre-de-trabalho';

export const loginPath = '/login';


export const SERVER_PAGINATION_PAGE_INDEX = 'page';
export const SERVER_PAGINATION_PAGE_SIZE = 'size';
export const SERVER_PAGINATION_PAGE_SORT = 'sort';
export const SERVER_PAGINATION_PAGE_SORT_ASC = 'asc';
export const SERVER_PAGINATION_PAGE_SORT_DESC = 'desc';
