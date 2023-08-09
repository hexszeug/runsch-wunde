import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { testList, testPlayback } from './testData';
import { useCallback, useState } from 'react';
import Search from './Search';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
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
    <>
      <section className="section">
        <Navbar />
      </section>
      <section className="section">
        <main className="container">
          <div className="block">
            <Search value={query} onChange={handleQueryChange} />
          </div>
          {query !== '' && (
            <div className="block">
              <TrackList tracks={testList.concat(null)} />
            </div>
          )}
        </main>
      </section>
      {query === '' && <Footer />}
      {trackAdded && <TrackAdded data={trackAddedData} />}
    </>
  );
}

export default App;
