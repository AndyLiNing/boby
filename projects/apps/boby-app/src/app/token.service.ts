import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { BehaviorSubject, concatMap, map, ReplaySubject, share, tap, timer } from "rxjs";

const ACCESS_TOKEN_TIMEOUT = 10 * 1000;
const INIT_TOKEN_URL = 'init_tokens_url'
const TOKEN_URL = 'token_url'

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private  refreshToken$$ = new ReplaySubject<string>(1);
  private  initAccessToken$$ = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) {}

  init() {
    this.httpClient.get<Tokens>(INIT_TOKEN_URL).pipe(tap(({refreshToken, accessToken}) => {
      this.refreshToken$$.next(refreshToken);
      this.initAccessToken$$.next(accessToken);
    }))
  }

  accessToken$ = !this.initAccessTokenHasExpired() ?
    this.initAccessToken$$.asObservable() :
    this.refreshToken$$.pipe(
        concatMap((refreshToken) => this.httpClient.get<Tokens>(TOKEN_URL, this.buildRefreshTokenOption(refreshToken))),
        tap(({ refreshToken }) =>  this.refreshToken$$.next(refreshToken)),
        map(({ accessToken }) => accessToken),
        share({
          connector: () => new ReplaySubject(1),
          resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
    }));

  private buildRefreshTokenOption(refreshToken: string): { headers: HttpHeaders } {
    return { headers: new HttpHeaders().set('refreshToken', refreshToken)}
  }

  private initAccessTokenHasExpired(): boolean {
    // TODO: Add the logic to test if the initAccessToken expired
    return this.initAccessToken$$.getValue() !== 'test';
  }

}
