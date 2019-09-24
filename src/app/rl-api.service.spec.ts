import { TestBed } from '@angular/core/testing';

import { RlAPIService } from './rl-api.service';

describe('RlAPIService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RlAPIService = TestBed.get(RlAPIService);
    expect(service).toBeTruthy();
  });
});
