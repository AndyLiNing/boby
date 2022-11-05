import { Inject, Injectable, OnDestroy } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { HttpClient } from "@angular/common/http";

import {
  BehaviorSubject, catchError, EMPTY, map,
  ReplaySubject,
  share, Subscription,
  tap,
  timer
} from "rxjs";

import {
  buildFetchTokenByAuthCodeBody,
  buildFetchTokenByRefreshTokenBody,
  buildFetchTokenUrl,
  buildFetchAuthCodeUrl,
  isJwtTokenExpired
} from './token.utils'

import {
  AUTH_CODE_QUERY_PARAM_KEY,
  AUTH_CODE_ERROR_QUERY_PARAM_KEY,
  HAS_FETCHED_AUTH_CODE_KEY,
  HEADER,
  HOST,
  REFRESH_TOKEN_STORAGE_KEY
} from "./token.config";
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
    if(!this.hasFetchedAuthCode()) {
      sessionStorage.removeItem(HAS_FETCHED_AUTH_CODE_KEY);
    }

    // Note: in the case of reloading the page, to avoid re-fetching auth_code
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? '';
    if (!isJwtTokenExpired(refreshToken)) {
      return this.refreshToken$$.next(refreshToken);
    }

    this.fetchTokensByAuthCode();
  }

  accessToken$ = this.getAccessToken();

  // TODO: Optional
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private fetchTokensByAuthCode() {
    const hasFetchedAuthCode = !!sessionStorage.getItem(HAS_FETCHED_AUTH_CODE_KEY);
    if (!hasFetchedAuthCode) {
        this.fetchAuthCodeAndUpdateStorageFetchingFlag();
    }
    this.subscription.add(
            this.httpClient.post<TokensResponse>(
              buildFetchTokenUrl(),
              buildFetchTokenByAuthCodeBody(this.getAuthCodeFromUrl(), this.getRedirectUri()),
              HEADER).pipe(
              tap(({refreshToken, accessToken, expires_in}) => {
                this.updateRefreshToken(refreshToken);
                this.initAccessToken$$.next(accessToken);
                this.expiresIn$$.next(expires_in);
              }),
              catchError(this.redirectToArcade)
            )
          .subscribe()
    );
  }

  private getAccessToken() {

    if(!isJwtTokenExpired(this.initAccessToken$$.getValue())) {
      return this.initAccessToken$$.asObservable();
    }
    // // TODO: Temporary code, testing purpose
    // return this.httpClient.get<string>(TOKEN_URL).pipe(
    //   tap((data) =>  this.refreshToken$$.next(data)),
    //   map((data) => data),
    //   share({
    //     connector: () => new ReplaySubject(1),
    //     resetOnComplete: () => timer(ACCESS_TOKEN_TIMEOUT),
    //   }));

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

  private fetchAuthCodeAndUpdateStorageFetchingFlag(): void {
    this.document.defaultView!.location.href = buildFetchAuthCodeUrl(this.getRedirectUri());
    sessionStorage.setItem(HAS_FETCHED_AUTH_CODE_KEY, 'true');
    return;
  }

  private updateRefreshToken(refreshToken: string) {
    this.refreshToken$$.next(refreshToken);
    sessionStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  }

  private redirectToArcade() {
      console.log('redirectToArcade')
      // TODO: Redirect to ARCADE
      // this.router.navigate([]);
      return EMPTY;
  }

  private getAuthCodeFromUrl(): string {
    return this.getQueryParams().split(AUTH_CODE_QUERY_PARAM_KEY)[1];
  }

  private getRedirectUri () {
    const { protocol, host, pathname } = this.document.defaultView!.location
    return protocol + '//' + host + pathname
  }

  private hasFetchedAuthCode (): boolean {
    const query = this.getQueryParams();
    return query.includes(AUTH_CODE_QUERY_PARAM_KEY) || query.includes(AUTH_CODE_ERROR_QUERY_PARAM_KEY);
  }

  private getQueryParams (): string {
    const { search } = this.document.defaultView!.location;
    return search;
  }

}
