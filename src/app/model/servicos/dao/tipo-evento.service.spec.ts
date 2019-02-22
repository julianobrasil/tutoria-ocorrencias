/* tslint:disable:no-unused-variable */

import {async, inject, TestBed} from '@angular/core/testing';
import {TipoEventoService} from './tipo-evento.service';

describe('TipoEventoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoEventoService],
    });
  });

  it(
    'should ...',
    inject([TipoEventoService], (service: TipoEventoService) => {
      expect(service).toBeTruthy();
    }),
  );
});
