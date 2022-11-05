import pkceChallenge from 'pkce-challenge';
import jwt_decode from 'jwt-decode';

import { HOST, GET_BY_AUTH_CODE_PATH, GET_BY_REFRESH_TOKEN_PATH } from "./token.config";

const { code_challenge, code_verifier } = pkceChallenge();

export const buildFetchAuthCodeUrl = (redirectUri: string): string => {
  const queryParams = [
    `response_type=code`,
    `client_id=ventegd-bouyguestelecom-fr`,
    `redirect_uri=${redirectUri}`,
    `code_challenge=${code_challenge}`,
    `code_challenge_method=S256`,
    `prompt=none`
  ]
  return HOST + GET_BY_AUTH_CODE_PATH + '?' + queryParams.join('&')
}

export const buildFetchTokenUrl = (): string => HOST + GET_BY_REFRESH_TOKEN_PATH;

export const buildFetchTokenByAuthCodeBody = (authCode: string, redirectUri: string): string =>
  [
    `grant_type=authorization_code`,
    `client_id=ventegd-poc-bouyguestelecom-fr`,
    `redirect_uri=${encodeURI(redirectUri)}`,
    `code=${authCode}`,
    `code_verifier=${code_verifier}`
  ].join('&')

export const buildFetchTokenByRefreshTokenBody = (refresh_token: string): string =>
  [
    `grant_type=refresh_token`,
    `client_id=ventegd-bouyguestelecom-fr`,
    `refresh_token=${refresh_token}`
  ].join('&')

export const isJwtTokenExpired = (token: string): boolean => {
  if (!token) {
    return true;
  }

  const { exp } = jwt_decode<{exp: number}>(token);
  return new Date().getTime() / 1000 > exp;
}
