import { TestBed } from '@angular/core/testing';

import { SubscheduleService } from './subschedule.service';

describe('SubscheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscheduleService = TestBed.get(SubscheduleService);
    expect(service).toBeTruthy();
  });
});
