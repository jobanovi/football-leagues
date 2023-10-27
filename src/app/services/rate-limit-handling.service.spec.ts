import { TestBed } from '@angular/core/testing';

import { RateLimitHandlingService } from './rate-limit-handling.service';

describe('RateLimitHandlingService', () => {
  let service: RateLimitHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateLimitHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
