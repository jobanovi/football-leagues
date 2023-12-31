import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeagueDataService {

  public static season: number = new Date().getFullYear();

  private readonly leagueNamesAndIds: Map<string, number> = new Map<string, number>([
    ["england", 39],
    ["spain", 140],
    ["germany", 78],
    ["france", 61],
    ["italy", 135],
  ]);
  constructor() { }

  getLeagueIdFor(leagueName: string): number {
    if (!this.leagueNamesAndIds.has(leagueName)) {
      throw new Error("Invalid league name provided: " + leagueName);
    }

     // added ?? operator to fix "Type 'number | undefined' is not assignable to type 'number'."
    return this.leagueNamesAndIds.get(leagueName) ?? 39;
  }
}
