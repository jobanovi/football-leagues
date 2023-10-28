import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subscription} from "rxjs";
import {LeagueStandingsRequest} from "./league-standings-request";
import {LeagueDataService} from "./league-data.service";

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private httpClient: HttpClient) {
  }

  getStandings(leagueStandingsRequest: LeagueStandingsRequest): Observable<string> {
    return this.httpClient.get<string>("https://v3.football.api-sports.io/standings", {
      params: {league: leagueStandingsRequest.leagueId, season: LeagueDataService.season},
      headers: leagueStandingsRequest.customHeaders
    });
  }
}
