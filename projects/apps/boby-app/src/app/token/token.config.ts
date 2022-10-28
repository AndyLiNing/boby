export const HEADER = { headers: {'content-type' : 'application/x-www-form-urlencoded'} }

export const HOST = 'https://iam.sandbox.bouyguestelecom.fr/ap3/';

export const REFRESH_TOKEN_STORAGE_KEY = 'gd_refresh_token';

const PATH = 'sesame/realms/partners/protocol/openid-connect/';

export const GET_BY_AUTH_CODE_PATH = PATH + 'auth';

export const GET_BY_REFRESH_TOKEN_PATH = PATH + 'token';
