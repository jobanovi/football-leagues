import { TestBed } from '@angular/core/testing';

import { KeyProviderService } from './key-provider.service';

describe('KeyProviderService', () => {
  let service: KeyProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
