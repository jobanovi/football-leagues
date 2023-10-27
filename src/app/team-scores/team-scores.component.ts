import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {TeamService} from "../services/team.service";
import {FixtureModel} from "../models/fixture-model";
import {Router} from "@angular/router";
import {TeamScoresRequest} from "../services/team-scores-request";
import {HttpHeaders} from "@angular/common/http";
import {RateLimitHandlingService} from "../services/rate-limit-handling.service";

@Component({
  selector: 'app-team-scores',
  templateUrl: './team-scores.component.html',
  styleUrls: ['./team-scores.component.css']
})
export class TeamScoresComponent implements OnChanges {

  @Input()
  lid!: number; // input done from url

  @Input()
  tid!: number; // input done from url

  gamesScores: GameScore[] = [];

  constructor(private teamService: TeamService, private router: Router, private rateLimitHandlingService: RateLimitHandlingService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lidChange: SimpleChange = changes["lid"];
    const tidChange: SimpleChange = changes["tid"];

    if ((lidChange && lidChange.currentValue) && (tidChange && tidChange.currentValue)) {
      this.getTeamScores({leagueId: this.lid, teamId: this.tid})
    }
  }

  getTeamScores(teamScoresRequest: TeamScoresRequest): void {
    this.teamService.getScores(teamScoresRequest).subscribe({
      next: (sc: string) => {
        // for some reason football api returns different json model for errors when rate limit reached
        if (this.rateLimitHandlingService.isRateLimitIssue(sc)) {
          this.getTeamScores({
            leagueId: teamScoresRequest.leagueId,
            teamId: teamScoresRequest.teamId,
            customHeaders: new HttpHeaders().set(RateLimitHandlingService.switchKeyHeaderName, RateLimitHandlingService.switchKeyHeaderValue)
          });
          return;
        }

        const fixtureData: FixtureModel = JSON.parse(JSON.stringify(sc)) as FixtureModel;
        fixtureData.response.forEach(response => {
          const gameScore: GameScore = new GamesScoreBuilder()
            .addHomeTeam(response.teams.home.name)
            .addAwayTeam(response.teams.away.name)
            .addHomeTeamLogo(response.teams.home.logo)
            .addAwayTeamLogo(response.teams.away.logo)
            .addHomeTeamGoals(response.goals.home)
            .addAwayTeamGoals(response.goals.away)
            .addDate(new Date(response.fixture.date))
            .build();

          this.gamesScores.push(gameScore);
        })

        // filtering with query params didn't work so filtering here
        this.gamesScores = this.gamesScores.filter(gs => gs.date <= new Date())
          .slice(0, 10)
          .sort((gs1, gs2) => gs2.date.getTime() - gs1.date.getTime());

        console.log(this.gamesScores);

      },
      error: (e) => console.error("Error while getting team score " + e),
      complete: () => console.info('Complete receiving team scores')
    });
  }


  onBackButtonClick() {
    const url: string = "/leagues/" + this.lid;
    this.router.navigateByUrl(url).then(
      res => { // Success
        console.log("Navigated to url " + url);
      },
      err => { // Error
        console.error("Error while navigating to url " + url + ", " + err);
      }
    );
  }
}

class GameScore {

  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
  date: Date;

  constructor(builder: GamesScoreBuilder) {
    this.homeTeam = builder.homeTeam;
    this.awayTeam = builder.awayTeam;
    this.homeTeamLogo = builder.homeTeamLogo;
    this.awayTeamLogo = builder.awayTeamLogo;
    this.homeTeamGoals = builder.homeTeamGoals;
    this.awayTeamGoals = builder.awayTeamGoals;
    this.date = builder.date;
  }
}

class GamesScoreBuilder {

  private _homeTeam!: string;
  private _awayTeam!: string;
  private _homeTeamLogo!: string;
  private _awayTeamLogo!: string;
  private _homeTeamGoals!: number;
  private _awayTeamGoals!: number;
  private _date!: Date;

  addHomeTeam(homeTeam: string): GamesScoreBuilder {
    this._homeTeam = homeTeam;
    return this;
  }

  addAwayTeam(awayTeam: string): GamesScoreBuilder {
    this._awayTeam = awayTeam;
    return this;
  }

  addHomeTeamLogo(homeTeamLogo: string): GamesScoreBuilder {
    this._homeTeamLogo = homeTeamLogo;
    return this;
  }

  addAwayTeamLogo(awayTeamLogo: string): GamesScoreBuilder {
    this._awayTeamLogo = awayTeamLogo;
    return this;
  }

  addHomeTeamGoals(homeTeamGoals: number): GamesScoreBuilder {
    this._homeTeamGoals = homeTeamGoals;
    return this;
  }

  addAwayTeamGoals(awayTeamGoals: number): GamesScoreBuilder {
    this._awayTeamGoals = awayTeamGoals;
    return this;
  }

  addDate(date: Date): GamesScoreBuilder {
    this._date = date;
    return this;
  }

  get homeTeam(): string {
    return this._homeTeam;
  }

  get awayTeam(): string {
    return this._awayTeam;
  }

  get homeTeamLogo(): string {
    return this._homeTeamLogo;
  }

  get awayTeamLogo(): string {
    return this._awayTeamLogo;
  }

  get homeTeamGoals(): number {
    return this._homeTeamGoals;
  }

  get awayTeamGoals(): number {
    return this._awayTeamGoals;
  }

  get date(): Date {
    return this._date;
  }

  build(): GameScore {
    return new GameScore(this);
  }

}
