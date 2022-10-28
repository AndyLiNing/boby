import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { catchError, concatMap, EMPTY, Observable } from "rxjs";

import { TokenService } from "./token.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('req.url: ', req.url)
    // TODO: Temporary code testing purpose
    if(req.url === 'https://jsonplaceholder.typicode.com/posts/1') {
      return next.handle(req);
    }
    // TODO: Add filters to bypass the requests which don't need accessToken
    if (req.url === '/token' || req.url === '/auth' ||
      req.url.startsWith('https://iam.sandbox.bouyguestelecom.fr/ap3/sesame/realms/partners/protocol/openid-connect/')) {
      return next.handle(req);
    }
    return this.tokenService.accessToken$.pipe(
        concatMap((accessToken) =>
           next.handle(
             req.clone({
               headers: req.headers.set('Authorization ', `Bearer ${accessToken}`)
             })
           ).pipe(catchError((error: HttpErrorResponse) => {
             console.log('error: ', error)
              // TODO: Catch the refresh token expires error
              if(error.error === ''){
                this.router.navigate([])
                return EMPTY;
              }
             throw error;
           }))
        ))
  }

}
