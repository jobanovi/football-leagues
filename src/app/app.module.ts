import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LeagueNavigationComponent} from './league-navigation/league-navigation.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TeamScoresComponent} from './team-scores/team-scores.component';
import {LeagueStandingsComponent} from './league-standings/league-standings.component';
import {AppRoutingModule} from "./app-routing.module";
import {AuthorizationInterceptor} from "./interceptors/http-request-interceptor.service";
import {CachingInterceptor} from "./interceptors/caching.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    LeagueNavigationComponent,
    TeamScoresComponent,
    LeagueStandingsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
