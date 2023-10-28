import {Component, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges} from '@angular/core';
import {LeagueStandingsModel, Standing} from "../models/league-standings-model";
import {LeagueService} from "../services/league.service";
import {HttpHeaders} from "@angular/common/http";
import {RequestContext} from "../services/request-context";
import {RateLimitHandlingService} from "../services/rate-limit-handling.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-league-standings',
  templateUrl: './league-standings.component.html',
  styleUrls: ['./league-standings.component.css'],
})
export class LeagueStandingsComponent implements OnChanges, OnDestroy {

  @Input()
  lid!: number; // input done from url

  standingsArray?: Standing[]

  subscription?: Subscription;

  constructor(private leagueService: LeagueService, private rateLimitHandlingService: RateLimitHandlingService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const lidChange: SimpleChange = changes["lid"];

    if (lidChange && lidChange.currentValue) {
      this.getLeagueStandings({leagueId: this.lid});
    }
  }

  getLeagueStandings(leagueStandingsRequest: RequestContext): void {
   this.subscription =  this.leagueService.getStandings(leagueStandingsRequest).subscribe({
      next: (ls: string) => {
        // for some reason football api returns different json model for errors when rate limit reached
        if (this.rateLimitHandlingService.isRateLimitIssue(ls)) {
          this.getLeagueStandings(
            {
              leagueId: leagueStandingsRequest.leagueId,
              customHeaders: new HttpHeaders().set(RateLimitHandlingService.switchKeyHeaderName, RateLimitHandlingService.switchKeyHeaderValue)
            });
          return;
        }

        const standingsContext: LeagueStandingsModel = JSON.parse(JSON.stringify(ls)) as LeagueStandingsModel;

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
      },
      error: (e) => console.error("Error while getting league standings " + e),
      complete: () => console.info('Complete receiving league standings')
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
