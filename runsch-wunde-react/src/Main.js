import { useCallback, useRef, useState } from 'react';
import Search from './Search';
import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { testList, testPlayback } from './testData';
import { api } from './api';

const Main = () => {
  // overlay
  const [trackAdded, trackAddedData, showTrackAdded] = useTrackAdded();
  window.testOverlay = () => {
    showTrackAdded({
      track: testList[Math.floor(Math.random() * testList.length)],
      queue: testList,
      playback: testPlayback,
    });
  };

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
  return (
    <main className="container">
      <div className="block">
        <Search value={query} onChange={handleQueryChange} />
      </div>
      {query !== '' && (
        <div className="block">
          <TrackList tracks={tracks} />
        </div>
      )}
      {trackAdded && <TrackAdded data={trackAddedData} />}
    </main>
  );
};

export default Main;
