import {Injectable} from '@angular/core';

import {Evento, Interacao} from '../../../../model/transport-objects';

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaBadgeComponentService {
  /** Configura texto do badge */
  setupUserRole(ocorrencia: Evento, comentario: Interacao): string {
    throw new Error('Method not implemented.');
  }
}
