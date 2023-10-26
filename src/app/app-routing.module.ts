import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LeagueStandingsComponent} from "./league-standings/league-standings.component";
import {TeamScoresComponent} from "./team-scores/team-scores.component";

const routes: Routes = [
  {path: "leagues/:lid", component: LeagueStandingsComponent},
  {path: "leagues/:lid/team/:tid", component: TeamScoresComponent},
  // {path: '**', component: NotFoundComponent} TODO
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true
  })],
  exports: [RouterModule]// todo see if this can be removed
})
export class AppRoutingModule {
}
