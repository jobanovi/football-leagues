export interface Errors {
  rateLimit: string;
}

export interface Paging {
  current: number;
  total: number;
}

export interface RateLimitModel {
  get: string;
  parameters: string[];
  errors: Errors;
  results: number;
  paging: Paging;
  response: string[];
}
