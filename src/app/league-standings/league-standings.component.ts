import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {LeagueStandingsModel, Standing} from "../models/league-standings-model";
import {RateLimitModel} from "../models/rate-limit-model";
import {LeagueService} from "../services/league.service";
import {LeagueStandingsRequest} from "../services/league-standings-request";
import {HttpHeaders} from "@angular/common/http";
import {RequestContext} from "../services/request-context";

@Component({
  selector: 'app-league-standings',
  templateUrl: './league-standings.component.html',
  styleUrls: ['./league-standings.component.css'],
})
export class LeagueStandingsComponent implements OnChanges {

  @Input()
  lid!: number; // input done from url

  standingsArray?: Standing[]

  constructor(private leagueService: LeagueService) { // TODO improve service naming here
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lidChange: SimpleChange = changes["lid"];

    if (lidChange && lidChange.currentValue) {
      this.getLeagueStandings({leagueId: this.lid});
    }
  }

  getLeagueStandings(leagueStandingsRequest: RequestContext): void {
    this.leagueService.getStandings(leagueStandingsRequest).subscribe(ls => {
      // for some reason football api returns different json model for errors when rate limit reached
      const rateLimitModel: RateLimitModel = JSON.parse(JSON.stringify(ls)) as RateLimitModel; // TODO avoid double parse and stringify
      if (!Array.isArray(rateLimitModel.errors)) { // TODO move to service
        // alert("Unable to provide new results");
        console.error(rateLimitModel.errors);
        const customHeaders: HttpHeaders = new HttpHeaders().set("switch-key", 'true');
        this.getLeagueStandings({leagueId: leagueStandingsRequest.leagueId, customHeaders: customHeaders});
        return;
      }

      const standingsContext: LeagueStandingsModel = JSON.parse(JSON.stringify(ls)) as LeagueStandingsModel; // TODO test if it works without stringify and maybe add reviewer to parser

      // check some other errors
      if (standingsContext.errors && standingsContext.errors.length > 0) {
        alert("Unable to execute request");
        console.error("Errors: " + standingsContext.errors);
        return;
      }

      // only one response is provided
      const standings: Standing[][] = standingsContext.response[0].league.standings as Standing[][];

      // there should be only one Standing[]
      if (standingsContext.results === 1) {
        this.standingsArray = standings[0];
      }
    }); // TODO handle error and complete
  }

}
