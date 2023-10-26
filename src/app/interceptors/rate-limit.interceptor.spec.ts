import { TestBed } from '@angular/core/testing';

import { RateLimitInterceptor } from './rate-limit.interceptor';

describe('RateLimitInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      RateLimitInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: RateLimitInterceptor = TestBed.inject(RateLimitInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
