import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LeagueStandingsComponent} from "./league-standings/league-standings.component";
import {TeamScoresComponent} from "./team-scores/team-scores.component";
import {NotFoundComponent} from "./not-found/not-found.component";

const routes: Routes = [
  {path: "leagues/:lid", component: LeagueStandingsComponent},
  {path: "leagues/:lid/team/:tid", component: TeamScoresComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    bindToComponentInputs: true
  })],
  exports: [RouterModule]// todo see if this can be removed
})
export class AppRoutingModule {
}
