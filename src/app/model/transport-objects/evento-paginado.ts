import {Evento} from './evento';

export interface EventoPaginado {
  content?: Evento[];
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  size?: number;
  number?: number;
  sort?: string;
  numberOfElements?: number;
  first?: boolean;
}
