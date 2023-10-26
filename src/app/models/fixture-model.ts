export interface Fixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: string;
    second: string;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  winner: string;
}

export interface Goals {
  home: number;
  away: number;
}

export interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}

export interface FixtureResponse {
  fixture: Fixture;
  league: League;
  teams: {
    home: Team;
    away: Team;
  };
  goals: Goals;
  score: Score;
}

export interface FixtureModel {
  get: string;
  parameters: {
    league: string;
    season: string;
    team: string;
  };
  errors: string[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: FixtureResponse[];
}
