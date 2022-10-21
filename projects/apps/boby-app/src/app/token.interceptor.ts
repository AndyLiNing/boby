import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

import { concatMap, Observable } from "rxjs";

import { TokenService } from "./token.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.tokenService.accessToken$.pipe(
        concatMap((accessToken) =>
           next.handle(
             req.clone({
               headers: req.headers.set('bearer ', accessToken)
             })
           )
        ))
  }
}
