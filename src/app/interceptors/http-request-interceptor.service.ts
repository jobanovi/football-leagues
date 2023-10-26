import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, Observable, retry, tap, throwError} from 'rxjs';

@Injectable()
export class AuthorizationInterceptor implements HttpInterceptor {

  private static readonly rateLimitMinuteMsg: string = "Too many requests. Your rate limit is 10 requests per minute.";
  private static readonly rateLimitDayMsg: string = "You have reached the request limit for the day";
  constructor() {}

  // type parameter is the body type and body in request is null
  intercept(request: HttpRequest<null>, next: HttpHandler): Observable<HttpEvent<string>> {
    console.log("headers before: " + request.headers.keys());
    let reqClone: HttpRequest<null>
    if (request.headers.has('switch-key')) {
      reqClone = request.clone({
        headers: request.headers
          .set('x-rapidapi-host', "v3.football.api-sports.io")
          .set('x-rapidapi-key', '0700862f2c8329dd671a20b8c96e58bb')
          .delete('switch-key') // TODO as a constant
      });
    } else {
      reqClone = request.clone({
        headers: request.headers.set('x-rapidapi-host', "v3.football.api-sports.io")
          .set('x-rapidapi-key', 'a0efa8d3ccc54bd4d678b69fd4e67480')
      });
    }

    console.log("headers after: " + reqClone.headers.keys());
    console.log("set header: " + reqClone.headers.get('x-rapidapi-key'));

    return next.handle(reqClone)
      // .pipe(
      // tap({
      //   next: (event) => {
      //     if (event instanceof HttpResponse) {
      //       console.log(event.status + " " + event.statusText);
      //       console.log(JSON.stringify(event.body));
      //       // TODO improve this check, and do stringify once
      //
      //       if (event.body
      //         && (JSON.stringify(event.body).includes(AuthorizationInterceptor.rateLimitMinuteMsg)
      //           || JSON.stringify(event.body).includes(AuthorizationInterceptor.rateLimitDayMsg))) {
      //         const reqClone2: HttpRequest<null> = reqClone.clone({
      //           headers: request.headers.set('x-rapidapi-host', "v3.football.api-sports.io")
      //             .set('x-rapidapi-key', 'a0efa8d3ccc54bd4d678b69fd4e67480')
      //         });
      //         console.log("Added new key " + reqClone2.headers.get('x-rapidapi-key'));
      //         // return switchMap(() => next.handle(reqClone2));
      //         let obs: Observable<HttpEvent<string>> = this.intercept(reqClone2, next);
      //         return obs;
      //         // return next.handle(reqClone2);
      //       }
      //
      //       if(event.status == 401) {
      //         alert('Unauthorized access!')
      //       }
      //     }
      //     return event;
      //   },
      //   error: (error) => {
      //     if(error.status === 401) {
      //       alert('Unauthorized access!')
      //     }
      //     else if(error.status === 404) {
      //       alert('Page Not Found!')
      //     }
      //   }
      //
      // }));
  }

  // 0700862f2c8329dd671a20b8c96e58bb
  // a0efa8d3ccc54bd4d678b69fd4e67480
}


export class AuthorizationInterceptor1 implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(n => {
        console.log("First")
        const modifiedReq = req.clone({
          setHeaders: {
            Authorization: 'Bearer new-token-here',
          },
        });
        return next.handle(modifiedReq).pipe(
          retry(1), // Retry once
          catchError((retryError) => {
            // Handle the retry error here
            return throwError(retryError);
          })
        );
      }),
      catchError((error) => {
        if (error.status === 401) {
          // Modify the request header, for example, add an authentication token
          const modifiedReq = req.clone({
            setHeaders: {
              Authorization: 'Bearer new-token-here',
            },
          });

          // Retry the request with the modified header
          return next.handle(modifiedReq).pipe(
            retry(1), // Retry once
            catchError((retryError) => {
              // Handle the retry error here
              return throwError(retryError);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}


@Injectable()
export class AuthorizationIntercepto2r implements HttpInterceptor {
  private maxRetries = 1;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const reqClone: HttpRequest<null> = request.clone({
      headers: request.headers.set('x-rapidapi-host', "v3.football.api-sports.io")
        .set('x-rapidapi-key', 'a0efa8d3ccc54bd4d678b69fd4e67480')
    });
    return next.handle(reqClone).pipe(
      tap((e) => {
        console.log('[BAR]: response!', e);
        const modifiedRequest = this.modifyRequest(request);
        console.log("Changed header " + modifiedRequest.headers.get('x-rapidapi-host'))
        const obs:  Observable<HttpEvent<any>> = next.handle(modifiedRequest);
        return obs;
      }),
      retry(1) // Retry the request a maximum of maxRetries times
    );
  }

  private modifyRequest(request: HttpRequest<any>): HttpRequest<any> {
    // Modify the request header here

    return request.clone({
      headers: request.headers.set('x-rapidapi-host', "v3.football.api-sports.io")
        .set('x-rapidapi-key', '0700862f2c8329dd671a20b8c96e58bb')
    });
  }
}

