import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TeamScoresRequest} from "./team-scores-request";
import {LeagueDataService} from "./league-data.service";

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private httpClient: HttpClient) {
  }

  getScores(teamScoresRequest: TeamScoresRequest): Observable<string> {
    return this.httpClient.get<string>("https://v3.football.api-sports.io/fixtures", {
      params: {league: teamScoresRequest.leagueId, team: teamScoresRequest.teamId, season: LeagueDataService.season},
      headers: teamScoresRequest.customHeaders
      // TRIED TO USE "to" PARAM BUT IT DIDN'T RETURN ANYTHING
      //params: {league: leagueId, team: teamId, season: new Date().getFullYear(), to: this.getFormattedDate()}
    });
  }

  getFormattedDate(): string {
    const date = new Date();
    const year = '' + date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return year + '-' + month + '-' + day;
  }
}
