import { useCallback, useState } from 'react';
import Search from './Search';
import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { testList, testPlayback } from './testData';

const Main = () => {
  const [trackAdded, trackAddedData, showTrackAdded] = useTrackAdded();
  window.testOverlay = () => {
    showTrackAdded({
      track: testList[Math.floor(Math.random() * testList.length)],
      queue: testList,
      playback: testPlayback,
    });
  };
  const [query, setQuery] = useState('');
  const handleQueryChange = useCallback((e) => setQuery(e.target.value), []);
  return (
    <main className="container">
      <div className="block">
        <Search value={query} onChange={handleQueryChange} />
      </div>
      {query !== '' && (
        <div className="block">
          <TrackList tracks={testList.concat(null)} />
        </div>
      )}
      {trackAdded && <TrackAdded data={trackAddedData} />}
    </main>
  );
};

export default Main;
