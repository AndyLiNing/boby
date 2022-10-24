import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import {
  BehaviorSubject, concatMap, map,
  ReplaySubject,
  share,
  tap,
  timer
} from "rxjs";

import { buildFetchTokenByAuthCodeBody, buildGetAuthCodeUrl } from './token.utils'
import { HEADER } from "./token.config";
import { AuthTokensResponse } from "./token.model";

// TODO: Temporary code testing purpose
const ACCESS_TOKEN_TIMEOUT = 10 * 1000;
const TOKEN_URL =  'https://jsonplaceholder.typicode.com/posts/1';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private refreshToken$$ = new BehaviorSubject<string>('');
  private initAccessToken$$ = new BehaviorSubject<string>('');
  private expiresIn$$ = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient, @Inject (DOCUMENT) private document: Document) {}

  init() {
    // TODO: Add retrieve refresh token from Session Storage codes (in the case of reloading page)
    const redirectUri1 = this.getRedirectUri();
    this.httpClient.get<AuthTokensResponse>(buildGetAuthCodeUrl(redirectUri1)).pipe(
      concatMap(() => {
        const authCode = this.getAuthCodeFromUrl();
        const redirectUri2 = this.getRedirectUri();
        const body = buildFetchTokenByAuthCodeBody(authCode, redirectUri2);
        return this.httpClient.post<AuthTokensResponse>(TOKEN_URL, body, HEADER)
      }),
      tap(({refreshToken, accessToken, expires_in}) => {
          this.refreshToken$$.next(refreshToken);
          this.initAccessToken$$.next(accessToken);
          this.expiresIn$$.next(expires_in);
    }));

  }

  // TODO: Pseudo codes, to be removed
  fakeInit(){
    this.refreshToken$$.next('Fake Refresh Token');
    this.initAccessToken$$.next('Fake Access Token');
    this.expiresIn$$.next(300);
    console.log('getRedirectUri: ', this.getRedirectUri())
  }

  accessToken$ = this.getAccessToken();

  private getRedirectUri () {
    const { protocol, host, pathname } = this.document.defaultView!.location
    return protocol + '//' + host + pathname
  }

  private getAuthCodeFromUrl() {
    const { search } = this.document.defaultView!.location;

    return '';

  }

  private getAccessToken() {
    if(!this.isInitAccessTokenExpired()) {
      return this.initAccessToken$$.asObservable();
    }
    // TODO: To be removed, testing purpose
    return this.httpClient.get<string>(TOKEN_URL).pipe(
      tap((data) =>  this.refreshToken$$.next(data)),
      map((data) => data),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
      }));

    return this.httpClient.post<AuthTokensResponse>(TOKEN_URL, this.buildFetchTokenByRefreshTokenBody()).pipe(
      tap(() =>  this.initAccessToken$$.next('')),
      tap(({ refreshToken }) =>  this.refreshToken$$.next(refreshToken)),
      map(({ accessToken }) => accessToken),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
      }));

  }

  private buildFetchTokenByRefreshTokenBody(): { headers: HttpHeaders } | void {

    const refreshToke = this.refreshToken$$.getValue();
    if(!refreshToke){
      throw new Error('Refresh token empty! Please check if the refresh token has been handled correctly.')
    }

    // TODO: Adapting the refresh token header
    return { headers: new HttpHeaders().set('refreshToken', refreshToke)}
  }

  private isInitAccessTokenExpired(): boolean {
    // TODO: Add the logic to test if the initAccessToken expired
    if(!this.initAccessToken$$.getValue()){
      return true;
    }
    return this.initAccessToken$$.getValue() !== 'test';
  }

}
