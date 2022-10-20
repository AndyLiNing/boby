import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {concatMap, iif, map, mergeMap, Observable, of, ReplaySubject, share, tap, timer} from "rxjs";


const REFRESH_TOKEN_TIMEOUT = 50 * 1000;
const ACCESS_TOKEN_TIMEOUT = 10 * 1000;

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  initTokens$ = this.httpClient.get<Tokens>('init_tokens_url')

  constructor(private httpClient: HttpClient) {}

  initRefreshToken$ = this.initTokens$.pipe(concatMap(({refreshToken}) => refreshToken));

  initAccessToken$ = this.initTokens$.pipe(concatMap(({accessToken}) => accessToken));

  refreshToken$!: Observable<string>;

  accessToken$ = this.httpClient.get<Tokens>('token_url').pipe(
    tap(({ refreshToken }) => this.refreshToken$ = of(refreshToken)),
    map(({ accessToken }) => accessToken),
    share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
    })
  );
}
