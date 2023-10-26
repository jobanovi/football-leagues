export interface Paging {
  current: number;
  total: number;
}

export interface Goals {
  for: number;
  against: number;
}

export interface Stats {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: Goals;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Standing {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: Stats;
  home: Stats;
  away: Stats;
  update: string;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: Standing[][];
}

export interface StandingsResponse {
  league: League;
}

export interface LeagueStandingsModel {
  get: string;
  parameters: { league: string; season: string };
  errors: string[];
  results: number;
  paging: Paging;
  response: StandingsResponse[];
}
