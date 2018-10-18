import { TestBed } from '@angular/core/testing';

import { AggridService } from './aggrid.service';

describe('AggridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AggridService = TestBed.get(AggridService);
    expect(service).toBeTruthy();
  });
});
