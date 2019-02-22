export class Etapa {
  public tipoEtapa = '';
  public dataInicio?: Date | string = new Date();
  public dataFim?: Date | string = new Date();
  public parecer = '';
  public emailResponsavel = '';

  constructor() {}
}

Etapa['__class'] = 'Etapa';
