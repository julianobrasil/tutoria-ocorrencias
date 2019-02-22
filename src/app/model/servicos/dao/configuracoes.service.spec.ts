/* tslint:disable:no-unused-variable */

import {async, inject, TestBed} from '@angular/core/testing';
import {ConfiguracoesService} from './configuracoes.service';

describe('ConfiguracoesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfiguracoesService],
    });
  });

  it(
    'should ...',
    inject([ConfiguracoesService], (service: ConfiguracoesService) => {
      expect(service).toBeTruthy();
    }),
  );
});
