import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {

  private static requestCache: Map<string, TimeTrackingHttpResponse> = new Map<string, TimeTrackingHttpResponse>();

  constructor() {}

  // type parameter is the body type and body in request is null
  intercept(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<string>> {
    console.log("url with params" + request.urlWithParams);
    if (CachingInterceptor.requestCache.has(request.urlWithParams)
      && !CachingInterceptor.requestCache.get(request.urlWithParams)!.isTimeInCachedReached()) {
      console.log("returning response from the cache")
      return of(CachingInterceptor.requestCache.get(request.urlWithParams)!.response)
    }
    return this.sendRequest(request, next);
  }

  sendRequest(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<string>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log("Caching response: " + event);
          CachingInterceptor.requestCache.set(request.urlWithParams, new TimeTrackingHttpResponse(event, 10)); // TODO cnstant for minutes
        }
      })
    );
  }

}

class TimeTrackingHttpResponse {

  response: HttpResponse<string>;
  cachedDate: Date;
  timeInCache: number; // time to spent in cache in minutes

  constructor(response: HttpResponse<string>, timeInCache: number) {
    this.response = response;
    this.cachedDate = new Date();
    this.timeInCache = timeInCache;
  }

  isTimeInCachedReached(): boolean {
    const diffMs: number = new Date().valueOf() - this.cachedDate.valueOf();
    console.log("minutes in cache: " + (Math.round(((diffMs % 86400000) % 3600000) / 60000))); // TODO remove
    return Math.round(((diffMs % 86400000) % 3600000) / 60000) >= this.timeInCache;
  }

}
