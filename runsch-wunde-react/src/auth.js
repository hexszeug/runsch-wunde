const CLIENT_ID = '47581a90bfe64f069d2bf0aa54d3de9a';
const SCOPES = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'playlist-read-private',
  'playlist-modify-private',
  'playlist-modify-public',
];
const REDIRECT_URI = window.location.origin + window.location.pathname;

const base64urlEncode = (bytes) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const generateRandomUrlString = (byteLength) => {
  const bytes = window.crypto.getRandomValues(new Uint8Array(byteLength));
  return base64urlEncode(bytes);
};

const generateCodeChallenge = async (codeVerifier) => {
  const bytes = new TextEncoder().encode(codeVerifier);
  const digestBuffer = await window.crypto.subtle.digest('SHA-256', bytes);
  const digest = new Uint8Array(digestBuffer);
  return base64urlEncode(digest);
};

export const redirectToLogin = async () => {
  const state = generateRandomUrlString(16);
  const codeVerifier = generateRandomUrlString(32);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem('state', state);
  sessionStorage.setItem('code_verifier', codeVerifier);

  const query = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
    state,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location = 'https://accounts.spotify.com/authorize?' + query;
};

const handleQuery = () => {
  const query = new URLSearchParams(window.location.search);

  // check if waiting for code
  const state = sessionStorage.getItem('state');
  const codeVerifier = sessionStorage.getItem('code_verifier');
  if (state === null) return;

  // check if state is correct
  if (!query.has('state') || state !== query.get('state')) return;

  // request is verified and should contain the code
  sessionStorage.removeItem('state');
  sessionStorage.removeItem('code_verifier');
  return extractCode(query).then((code) =>
    fetchAndStoreAccessToken(code, codeVerifier)
  );
};

const extractCode = async (query) => {
  if (query.has('error'))
    throw new Error(`authorization failed: ${query.get('error')}`);
  if (!query.has('code')) throw new Error('missing authorization code');
  return query.get('code');
};

const fetchAndStoreAccessToken = async (code, codeVerifier) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });
  const data = await requestAuthApi(body);

  window.sessionStorage.setItem('access_token', data.access_token);
  window.sessionStorage.setItem('refresh_token', data.refresh_token);
};

export const refreshAndStoreAccessToken = async () => {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokens.refreshToken,
    client_id: CLIENT_ID,
  });
  const data = await requestAuthApi(body);

  tokens.accessToken = data.access_token;
  window.sessionStorage.setItem('access_token', data.access_token);
};

const requestAuthApi = async (body) => {
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  // handle errors in response
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      `token creation failed (${res.status} ${res.statusText}): ${data.error} (${data.error_description})`
    );

  return data;
};

/************************************************************/

export const tokens = {
  accessToken: null,
  refreshToken: null,
};

export const appState = {
  current: 'login',
  subscriptions: new Set(),
  getSnapshot: () => appState.current,
  subscribe: (callback) => {
    appState.subscriptions.add(callback);
    return () => appState.subscriptions.delete(callback);
  },
  update: (value) => {
    if (value === appState.current) return;
    appState.current = value;
    appState.subscriptions.forEach((callback) => callback());
  },
};

/*************************************************************/

if (window.location.search) {
  const processingQuery = handleQuery();
  if (processingQuery) {
    appState.update('loading');
    try {
      await processingQuery;
    } catch (e) {
      // todo popup error message to user
      console.error('uncaught error while authorizing:', e);
    } finally {
      window.history.replaceState(null, '', REDIRECT_URI);
    }
  }
}

tokens.accessToken = window.sessionStorage.getItem('access_token');
tokens.refreshToken = window.sessionStorage.getItem('refresh_token');

if (tokens.accessToken && tokens.refreshToken) {
  appState.update('normal');
} else {
  appState.update('login');
}
