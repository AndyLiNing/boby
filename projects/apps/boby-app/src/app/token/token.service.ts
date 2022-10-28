import { Inject, Injectable, OnDestroy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";

import {
  BehaviorSubject, catchError, concatMap, EMPTY, map,
  ReplaySubject,
  share, Subscription,
  tap,
  timer
} from "rxjs";

import {
  buildFetchTokenByAuthCodeBody,
  buildFetchTokenByRefreshTokenBody,
  buildFetchTokenUrl,
  buildFetchAuthCodeUrl
} from './token.utils'

import { HEADER, REFRESH_TOKEN_STORAGE_KEY } from "./token.config";
import { TokensResponse } from "./token.model";
import { Router } from "@angular/router";

// TODO: Temporary code testing purpose
const ACCESS_TOKEN_TIMEOUT = 10 * 1000;
const TOKEN_URL =  'https://jsonplaceholder.typicode.com/posts/1';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements OnDestroy {

  private initAccessToken$$ = new BehaviorSubject<string>('');
  private refreshToken$$ = new BehaviorSubject<string>('');
  private expiresIn$$ = new BehaviorSubject<number>(0);
  private subscription = new Subscription();

  constructor( private router: Router, private httpClient: HttpClient, @Inject (DOCUMENT) private document: Document) {}

  init() {
    // Note in the case of reloading the page
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (this.isRefreshTokenValid(refreshToken)) {
      // return this.refreshToken$$.next(refreshToken);
    }
    this.fetchTokensByAuthCode();
  }

  // TODO: Temporary code, testing purpose
  fakeInit(){
    this.refreshToken$$.next('Fake Refresh Token');
    this.initAccessToken$$.next('Fake init Access Token');
    this.expiresIn$$.next(300);
  }

  accessToken$ = this.getAccessToken();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchTokensByAuthCode() {
    this.subscription.add(
        this.httpClient.get<TokensResponse>(buildFetchAuthCodeUrl(this.getRedirectUri())).pipe(
          tap((data) => {
            console.log('data: ', data)
          }),
          concatMap(() =>
            this.httpClient.post<TokensResponse>(
              buildFetchTokenUrl(),
              buildFetchTokenByAuthCodeBody(this.getAuthCodeFromUrl(), this.getRedirectUri()),
              HEADER)
          ),
          tap(({refreshToken, accessToken, expires_in}) => {
            this.updateRefreshToken(refreshToken);
            this.initAccessToken$$.next(accessToken);
            this.expiresIn$$.next(expires_in);
          }),
          catchError(this.redirectToArcade)
        ).subscribe()
    );
  }

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
    // TODO: Temporary code, testing purpose
    return this.httpClient.get<string>(TOKEN_URL).pipe(
      tap((data) =>  this.refreshToken$$.next(data)),
      map((data) => data),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
      }));

    return this.httpClient.post<TokensResponse>(
      buildFetchTokenUrl(),
      buildFetchTokenByRefreshTokenBody(this.refreshToken$$.getValue()),
      HEADER
    ).pipe(
      tap(() =>  this.initAccessToken$$.next('')),
      tap(({ refreshToken }) => this.updateRefreshToken(refreshToken)),
      map(({ accessToken }) => accessToken),
      share({
        connector: () => new ReplaySubject(1),
        resetOnComplete: () => timer(this.expiresIn$$.getValue() - 10),
      }),
      catchError(this.redirectToArcade));

  }

  private isInitAccessTokenExpired(): boolean {
    // TODO: Add the logic to test if the initAccessToken expired
    if(!this.initAccessToken$$.getValue()){
      return true;
    }
    return this.initAccessToken$$.getValue() !== 'Fake init Access Token';
  }

  private updateRefreshToken(refreshToken: string) {
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    this.refreshToken$$.next(refreshToken);
  }

  private redirectToArcade() {
      // TODO: Redirect to ARCADE
      // this.router.navigate([]);
      return EMPTY;
  }

  private isRefreshTokenValid (refreshToken: string | null) {
    if(!refreshToken){
      return false;
    }
    // TODO: Logic to check if the token is valid
    return false;
  }

}
