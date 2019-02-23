export class Tutor {
  public nomeTutor = '';
  public email = '';
  public matricula = '';
  public dataInicio: Date | string = new Date();
  public dataFim?: Date | string = new Date();

  constructor() {}
}
Tutor['__class'] = 'Tutor';
