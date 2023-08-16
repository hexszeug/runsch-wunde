import { useCallback, useContext, useRef, useState } from 'react';
import Search from './Search';
import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { api } from './api';
import { ErrorContext } from './Error';

const Main = () => {
  // search
  const [query, setQuery] = useState('');
  const handleQueryChange = useCallback(
    async (e) => {
      const newQuery = e.target.value;
      setQuery(newQuery);
      if (newQuery === '') return;

      if (query === '') setTracks(Array(20).fill(null));
      const { items, total } = await api.search(newQuery, 0, 20);
      results.current = total;
      setTracks(items);
    },
    [query]
  );
  const [tracks, setTracks] = useState([]);
  const results = useRef(0);

  // add to queue
  const [trackAdded, trackAddedData, showTrackAdded] = useTrackAdded();
  const showError = useContext(ErrorContext);
  const addToQueue = useCallback(
    async (track) => {
      try {
        const playlistId = '5jPk5phURQcuu17s5twd54';

        // fetch queue cache and playback
        const [cache, playback] = await Promise.all([
          api.playlist(playlistId, 'items(added_at,track(uri,duration_ms))'),
          api.playback(),
        ]);
        if (!playback.item) {
          throw new Error('playback is not active');
        }

        // calculate part of cache which hasn't been played yet
        const songStart = playback.timestamp - playback.progress_ms - 12000; // 12 secs buffer for delay between add to queue and to cache
        // oldest song in the cache which hasn't been played yet
        const nextPlayingIndex = cache.findLastIndex(
          ({ added_at }, i, cache) => {
            return (
              cache[i + 1]?.uri === playback.item.uri ||
              Date.parse(added_at) > songStart
            );
          }
        );
        // -1 as nextPlayingIndex is correctly handled
        const queue = cache
          .slice(0, nextPlayingIndex + 1)
          .map(({ track }) => track);

        // potentially add song
        const alreadyInQueue = queue.some(({ uri }) => uri === track.uri);
        if (!alreadyInQueue) {
          queue.unshift(track);
          await Promise.all([
            api.pushQueue(track),
            api.unshiftPlaylist(playlistId, track),
          ]);
        }

        // show message to user
        showTrackAdded({ track, queue, playback, isNew: !alreadyInQueue });
      } catch (e) {
        showError();
        console.error('error while adding track to queue:', e);
      } finally {
        setQuery('');
      }
    },
    [showTrackAdded, showError]
  );
  return (
    <main className="container">
      <div className="block">
        <Search value={query} onChange={handleQueryChange} />
      </div>
      {query !== '' && (
        <div className="block">
          <TrackList tracks={tracks} addToQueue={addToQueue} />
        </div>
      )}
      {trackAdded && <TrackAdded data={trackAddedData} />}
    </main>
  );
};

export default Main;
