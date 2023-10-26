import {HttpHeaders} from "@angular/common/http";

export abstract class RequestContext {
  customHeaders?: HttpHeaders;
  leagueId!: number;
}
