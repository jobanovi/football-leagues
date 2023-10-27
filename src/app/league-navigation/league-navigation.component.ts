import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {LeagueDataService} from "../services/league-data.service";

@Component({
  selector: 'app-league-navigation',
  templateUrl: './league-navigation.component.html',
  styleUrls: ['./league-navigation.component.css']
})
export class LeagueNavigationComponent {

  constructor(private router: Router, private leagueData: LeagueDataService) {
  }

  onLeagueClick(id: string): void {
      const leagueName: string = id.substring(0, id.indexOf("Select"));
      const url: string = "/leagues/" + this.leagueData.getLeagueIdFor(leagueName).toString();
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
