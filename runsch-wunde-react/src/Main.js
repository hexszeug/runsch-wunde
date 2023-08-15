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
        const playlist = await api.playlist(playlistId);
        if (!playlist.some(({ uri }) => uri === track.uri)) {
          playlist.unshift(track);
          await Promise.all([
            api.pushQueue(track),
            api.unshiftPlaylist(playlistId, track),
          ]);
        }
        const playback = await loadingPlayback;
        const currentIndex = playlist.findIndex(
          ({ uri }) => uri === playback.item?.uri
        );
        const queue =
          currentIndex === -1 ? [track] : playlist.slice(0, currentIndex);
        showTrackAdded({ track, queue, playback });
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
