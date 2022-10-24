import pkceChallenge from 'pkce-challenge';

import { HOST, PATH } from "./token.config";

export const { code_challenge, code_verifier } = pkceChallenge();

export const buildGetAuthCodeUrl = (redirectUri: string) => {
  const queryParams = [
    `response_type=code`,
    `client_id=ventegd-bouyguestelecom-fr`,
    `scope=openid`,
    `redirect_uri= ${redirectUri}`,
    `code_challenge=${code_challenge}`,
    `code_challenge_method=S256`
  ]
  return HOST + PATH + '?' + queryParams.join('&')
}

export const buildFetchTokenByAuthCodeBody = (authCode: string, redirectUri: string) => {
  const postBody = [
    `grant_type=authorization_code`,
    `client_id=ventegd-poc-bouyguestelecom-fr`,
    `redirect_uri= ${encodeURI(redirectUri)}`,
    `code=${authCode}`,
    `code_verifier=${code_verifier}`
  ]
  return postBody.join('&');
}
