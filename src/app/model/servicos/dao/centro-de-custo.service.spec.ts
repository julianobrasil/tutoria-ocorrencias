/* tslint:disable:no-unused-variable */

import {async, inject, TestBed} from '@angular/core/testing';
import {CentroDeCustoService} from './centro-de-custo.service';

describe('CentroDeCustoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CentroDeCustoService],
    });
  });

  it(
    'should ...',
    inject([CentroDeCustoService], (service: CentroDeCustoService) => {
      expect(service).toBeTruthy();
    }),
  );
});
