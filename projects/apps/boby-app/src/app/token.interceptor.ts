import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { catchError, concatMap, EMPTY, Observable } from "rxjs";

import { TokenService } from "./token.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // TODO: Add filters to bypass the requests which don't need accessToken
    if (req.url === '/token' || req.url === '/auth') {
      return next.handle(req);
    }
    return this.tokenService.accessToken$.pipe(
        concatMap((accessToken) =>
           next.handle(
             req.clone({
               headers: req.headers.set('Authorization ', `Bearer ${accessToken}`)
             })
           ).pipe(catchError((error: HttpErrorResponse) => {
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
