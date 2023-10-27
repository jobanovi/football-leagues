import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RateLimitHandlingService} from "../services/rate-limit-handling.service";
import {KeyInfo, KeyProvider} from "../services/key-provider.service";

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  private keyInfo: KeyInfo;

  constructor(private keyProvider: KeyProvider) {
    this.keyInfo = keyProvider.getValidKey();
  }

  // type parameter is the body type and body in request is null
  intercept(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<string>> {
    let reqClone: HttpRequest<null>
    if (request.headers.has(RateLimitHandlingService.switchKeyHeaderName)) {
      // update existing key
      this.keyProvider.updateKey({key: this.keyInfo.key, isValid: false});
      // get another key
      this.keyInfo = this.keyProvider.getValidKey();
      reqClone = request.clone({
        headers: request.headers
          .set('x-rapidapi-host', "v3.football.api-sports.io")
          .set('x-rapidapi-key', this.keyInfo.key)
          .delete(RateLimitHandlingService.switchKeyHeaderName)
      });
    } else {
      reqClone = request.clone({
        headers: request.headers.set('x-rapidapi-host', "v3.football.api-sports.io")
          .set('x-rapidapi-key', this.keyInfo.key)
      });
    }

    return next.handle(reqClone)
  }
}
