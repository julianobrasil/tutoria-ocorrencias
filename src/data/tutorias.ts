import {Tutoria} from '../app/model/transport-objects';

export const TUTORIAS_EXISTENTES: Tutoria[] = [
  {
    id: '58b729cba239fe1bf9f62344',
    unidade: {
      id: '586a822fc2ef1624c38a9101',
      cidade: 'GOIÂNIA',
      unidade: 'PERIMETRAL',
    },
    turno: 'NOTURNO',
    semestreDeTrabalho: {ano: 2017, semestre: 1},
    historicoTutores: [{
      nomeTutor: 'JULIANO PÁVEL BRASIL CUSTÓDIO',
      email: 'juliano.custodio@unialfa.com.br',
      matricula: '2647',
      dataInicio: '2017-03-01T20:05:15.186Z',
    }],
    coordenadores: [
      {
        email: 'thales.takao@unialfa.com.br',
        nomeCoordenador: 'THALES BALIERO TAKAO',
      },
      {
        email: 'juliano.custodio@unialfa.com.br',
        nomeCoordenador: 'JULIANO PÁVEL BRASIL CUSTÓDIO',
      },
    ],
    turmas: [
      {
        grade: 'A',
        periodo: '5',
        cursoNome: 'Engenharia Elétrica',
        representantesTurmaTutoria: [
          {
            matricula: '20151173042',
            nomeRepresentanteTurmaTutoria: 'AIRAZEC NASCIMENTO SANTOS',
            telefone: '(62) 98160-5359',
            email: 'airazec_n_santos@hotmail.com',
          },
          {
            matricula: '20151171018',
            nomeRepresentanteTurmaTutoria: 'ADRIANO DE ALMEIDA SILVA',
            telefone: '(62) 99440-5509',
            email: 'adrianosilwa@hotmail.com',
            isVice: true,
          },
        ],
        centroDeCusto: {
          id: '586aa4dfc2ef1624c38b75eb',
          nomeCentroDeCusto: 'Engenharia Elétrica',
          codigo: '50926003',
          codigoCurso: 17,
          nomeCurso: 'Engenharia Elétrica',
          unidade: 'GOIÂNIA:PERIMETRAL',
          turno: 'NOTURNO',
        },
      },
      {
        grade: 'A',
        periodo: '5',
        cursoNome: 'Engenharia de Computação',
        representantesTurmaTutoria: [
          {
            matricula: '20151141028',
            nomeRepresentanteTurmaTutoria: 'ÁLEFE COSTA MACEDO',
            telefone: '(62) 98430-5167',
            email: 'almacedobr@hotmail.com',
          },
          {
            matricula: '201511433031',
            nomeRepresentanteTurmaTutoria: 'DAVID B. M. M. V. DE MELO',
            telefone: '(62) 98280-3053',
            email: 'dbrahiam@gmail.com',
            isVice: true,
          },
        ],
        centroDeCusto: {
          id: '586aa4dfc2ef1624c38b75e9',
          nomeCentroDeCusto: 'Engenharia de Computação',
          codigo: '50917006',
          codigoCurso: 14,
          nomeCurso: 'Engenharia de Computação',
          unidade: 'GOIÂNIA:PERIMETRAL',
          turno: 'NOTURNO',
        },
      },
      {
        grade: 'A',
        periodo: '6',
        cursoNome: 'Engenharia de Computação',
        representantesTurmaTutoria: [
          {
            matricula: '20151141028',
            nomeRepresentanteTurmaTutoria: 'ALEFE COSTA MACEDO',
            telefone: '(62) 98430-5167',
            email: 'ALMACEDO@HOTMAIL.COM',
          },
          {
            matricula: '20151143031',
            nomeRepresentanteTurmaTutoria: 'DAVID B. M. M.V. DE MELO',
            telefone: '(62) 98280-3053',
            email: 'BBRAHAM@GMAIL.COM',
            isVice: true,
          },
        ],
        centroDeCusto: {
          id: '586aa4dfc2ef1624c38b75e9',
          nomeCentroDeCusto: 'Engenharia de Computação',
          codigo: '50917006',
          codigoCurso: 14,
          nomeCurso: 'Engenharia de Computação',
          unidade: 'GOIÂNIA:PERIMETRAL',
          turno: 'NOTURNO',
        },
      },
    ],
    version: 11,
    lasModifiedDate: {$date: '2017-04-18T13:57:38.993Z'},
    lasModifiedBy: 'semusuario@alfa.br',
  },
];
