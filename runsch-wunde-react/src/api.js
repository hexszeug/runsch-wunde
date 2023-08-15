import { refreshAndStoreAccessToken, tokens } from './auth';

const BASE_URL = 'https://api.spotify.com/v1';

const request = async (
  path,
  method,
  query,
  body,
  options = {},
  retries = 1
) => {
  const search = query ? '?' + new URLSearchParams(query) : '';
  const url = BASE_URL + path + search;
  const res = await fetch(url, {
    method,
    ...(body && { body }),
    ...options,
    headers: {
      ...(body && { 'Content-Type': 'application/x-www-form-urlencoded' }),
      ...options.headers,
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  });
  const { status, statusText, headers, ok } = res;
  let resBody;
  try {
    resBody = await res.clone().json();
  } catch {
    resBody = await res.text();
  }

  if (ok) {
    return { status, headers, ok, body: resBody };
  }

  switch (status) {
    case 401:
      if (retries === 0) break;
      console.warn('token expired, refreshing token and retrying');
      await refreshAndStoreAccessToken();
      return request(path, method, query, body, options, retries - 1);
    case 503:
      if (retries === 0) break;
      return request(path, method, query, body, options, retries - 1);
    default:
      throw new Error(
        `api ${method} request to ${path} failed (${status} ${statusText}): ${resBody.error.message}`
      );
  }
};

export const api = {
  search: async (query, offset, pagesize) => {
    const { body } = await request('/search', 'GET', {
      q: query,
      type: 'track',
      offset,
      limit: pagesize,
    });
    return body.tracks;
  },
  pushQueue: async (track) => {
    await request('/me/player/queue', 'POST', { uri: track.uri });
  },
  playback: async () => {
    return (await request('/me/player', 'GET')).body;
  },
  playlist: async (playlistId) => {
    const {
      body: { items },
    } = await request(`/playlists/${playlistId}/tracks`, 'GET', {
      fields: 'items(track(uri,duration_ms))',
      limit: 50,
      offset: 0,
    });
    return items.map(({ track }) => track);
  },
  unshiftPlaylist: async (playlistId, track) => {
    await request(`/playlists/${playlistId}/tracks`, 'POST', {
      uris: [track.uri],
      position: 0,
    });
  },
};
