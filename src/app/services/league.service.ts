import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of, tap} from "rxjs";
import {RateLimitModel} from "../models/rate-limit-model";
import {LeagueStandingsRequest} from "./league-standings-request";

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private httpClient: HttpClient) {
  }

  getStandings(leagueStandingsRequest: LeagueStandingsRequest): Observable<string> {
    if (leagueStandingsRequest.customHeaders) {
      return this.httpClient.get<string>("https://v3.football.api-sports.io/standings", {
        params: {league: leagueStandingsRequest.leagueId, season: new Date().getFullYear()},
        headers: leagueStandingsRequest.customHeaders // TODO move to util or maybe create constant
      });
    }

    return this.httpClient.get<string>("https://v3.football.api-sports.io/standings", {
      params: {league: leagueStandingsRequest.leagueId, season: new Date().getFullYear()}// TODO move to util or maybe create constant
    });
  }
}

// this.headers = new HttpHeaders()
//   .set('x-rapidapi-host', 'v3.football.api-sports.io')
//   .set('x-rapidapi-key', 'a0efa8d3ccc54bd4d678b69fd4e67480');
// }
//
// getStandings(league: number): Observable<string> {
//   return this.httpClient.get<string>("https://v3.football.api-sports.io/standings", {headers: this.headers});
// }
