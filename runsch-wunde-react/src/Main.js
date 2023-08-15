import { useCallback, useRef, useState } from 'react';
import Search from './Search';
import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { api } from './api';

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
  const addToQueue = useCallback(
    async (track) => {
      try {
        const playlistId = window.localStorage.getItem('cache_playlist');
        if (playlistId === null)
          throw new Error('illegal state: missing cache playlist');
        const loadingPlayback = api.playback();
        const queue = await api.playlist(playlistId);
        const isNew = !queue.some(({ uri }) => uri === track.uri);
        if (isNew) {
          queue.unshift(track);
          await Promise.all([
            api.pushQueue(track),
            api.unshiftPlaylist(playlistId, track),
          ]);
        }
        const playback = await loadingPlayback;
        showTrackAdded({ track, queue, playback, isNew });
      } catch (e) {
        // todo popup error message to user
        console.error('error while adding track to queue:', e);
      } finally {
        setQuery('');
      }
    },
    [showTrackAdded]
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
