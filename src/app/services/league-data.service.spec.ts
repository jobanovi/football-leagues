import { TestBed } from '@angular/core/testing';

import { LeagueDataService } from './league-data.service';

describe('LeaguesDataService', () => {
  let service: LeagueDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
