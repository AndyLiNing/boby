export const HEADER = { headers: {'content-type' : 'application/x-www-form-urlencoded'} }

export const HOST = 'https://iam.sandbox.bouyguestelecom.fr/ap3/';

export const REFRESH_TOKEN_STORAGE_KEY = 'gd_refresh_token';

export const HAS_FETCHED_AUTH_CODE_KEY = 'gd_has_fetched_auth_code';

export const AUTH_CODE_QUERY_PARAM_KEY = '&code=';

export const AUTH_CODE_ERROR_QUERY_PARAM_KEY = 'error';

const PATH = 'sesame/realms/partners/protocol/openid-connect/';

export const GET_BY_AUTH_CODE_PATH = PATH + 'auth';

export const GET_BY_REFRESH_TOKEN_PATH = PATH + 'token';

console.log('token config')
export const TEST = {
  p1: 'p1'
}
