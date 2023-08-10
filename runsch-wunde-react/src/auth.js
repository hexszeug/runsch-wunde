const CLIENT_ID = '47581a90bfe64f069d2bf0aa54d3de9a';
const SCOPES = ['user-read-playback-state'];
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

const handleQuery = async () => {
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
  const code = extractCode(query);
  await fetchAndStoreAccessToken(code, codeVerifier);
};

const extractCode = (query) => {
  if (query.has('error'))
    throw new Error(`authorization failed: ${query.get('error')}`);
  if (!query.has('code')) throw new Error('missing authorization code');
  return query.get('code');
};

const fetchAndStoreAccessToken = async (code, codeVerifier) => {
  // request
  const req = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier,
  });
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: req,
  });

  // handle errors in response
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      `token creation failed (${res.status} ${res.statusText}): ${data.error} (${data.error_description})`
    );

  // set access and refresh token
  window.sessionStorage.setItem('access_token', data.access_token);
  window.sessionStorage.setItem('refresh_token', data.refresh_token);
  // todo make access token available to application
  // make state available to application (logged out / logging in / logged in)
};

/************************************************************/

window.sessionStorage.getItem('access_token');
window.sessionStorage.getItem('refresh_token');
// todo make access token available to application
// make state available to application (logged out / logging in / logged in)

if (window.location.search) {
  try {
    await handleQuery();
  } catch (e) {
    console.error('uncaught error while authorizing:', e);
  } finally {
    window.history.replaceState(null, '', REDIRECT_URI);
  }
}
