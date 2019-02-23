export class RepresentanteTurmaTutoria {
  nomeRepresentanteTurmaTutoria?: string;
  telefone?: string;
  email?: string;
  isVice?: boolean;
  matricula?: string;

  constructor() {
    this.nomeRepresentanteTurmaTutoria = '';
    this.matricula = '';
    this.telefone = '';
    this.email = '';
    this.isVice = false;
  }
}

RepresentanteTurmaTutoria['__class'] = 'RepresentanteTurmaTutoria';
