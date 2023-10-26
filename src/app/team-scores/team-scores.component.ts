import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {Standing} from "../models/league-standings-model";
import {TeamService} from "../services/team.service";
import {FixtureModel} from "../models/fixture-model";
import {Router} from "@angular/router";
import {TeamScoresRequest} from "../services/team-scores-request";
import {RateLimitModel} from "../models/rate-limit-model";
import {HttpHeaders} from "@angular/common/http";

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

  constructor(private teamService: TeamService, private router: Router) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lidChange: SimpleChange = changes["lid"];
    const tidChange: SimpleChange = changes["tid"];

    if ((lidChange && lidChange.currentValue) && (tidChange && tidChange.currentValue)) {
      this.getTeamScores({leagueId: this.lid, teamId: this.tid})
    }
  }

  getTeamScores(teamScoresRequest: TeamScoresRequest): void {
    this.teamService.getScores(teamScoresRequest).subscribe(sc => {
      // for some reason football api returns different json model for errors when rate limit reached
      const rateLimitModel: RateLimitModel = JSON.parse(JSON.stringify(sc)) as RateLimitModel; // TODO avoid double parse and stringify
      if (!Array.isArray(rateLimitModel.errors)) { // TODO move to service
        // alert("Unable to provide new results");
        console.error(rateLimitModel.errors);
        const customHeaders: HttpHeaders = new HttpHeaders().set("switch-key", 'true');
        this.getTeamScores({leagueId: teamScoresRequest.leagueId, teamId: teamScoresRequest.teamId, customHeaders: customHeaders});
        return;
      }

      const fixtureData: FixtureModel = JSON.parse(JSON.stringify(sc)) as FixtureModel; // TODO test if it works without stringify and maybe add reviewer to parser
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

    }); // TODO handle error and complete
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

  private _homeTeam?: string;
  private _awayTeam?: string;
  private _homeTeamLogo?: string;
  private _awayTeamLogo?: string;
  private _homeTeamGoals?: number;
  private _awayTeamGoals?: number;
  private _date?: Date;

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

  // todo remove typeassertions and do it better
  get homeTeam(): string {
    return <string>this._homeTeam;
  }

  get awayTeam(): string {
    return <string>this._awayTeam;
  }

  get homeTeamLogo(): string {
    return <string>this._homeTeamLogo;
  }

  get awayTeamLogo(): string {
    return <string>this._awayTeamLogo;
  }

  get homeTeamGoals(): number {
    return <number>this._homeTeamGoals;
  }

  get awayTeamGoals(): number {
    return <number>this._awayTeamGoals;
  }

  get date(): Date {
    return <Date>this._date;
  }

  build(): GameScore {
    // check if null or undefined
    // if (this._homeTeam == null||
    //   this._awayTeam == null ||
    //   this._homeTeamLogo == null ||
    //   this._awayTeamLogo == null ||
    //   this._homeTeamGoals == null ||
    //   this._awayTeamGoals == null ||
    //   this._date == null) {
    //   console.warn("All the GamesScore fields should be set");
    //
    //   // goals are null for games
    //   if (this._homeTeamGoals === null) {
    //     this._homeTeamGoals = 0;
    //   }
    //
    //   if (this._awayTeamGoals === null) {
    //     this._awayTeamGoals = 0;
    //   }
    // }

    return new GameScore(this);
  }

}
