import TrackAdded, { useTrackAdded } from './TrackAdded';
import TrackList from './TrackList';
import { testList, testPlayback } from './testData';

function App() {
  const [trackAdded, trackAddedData, showTrackAdded] = useTrackAdded();
  window.testOverlay = () => {
    showTrackAdded({
      track: testList[Math.floor(Math.random() * testList.length)],
      queue: testList,
      playback: testPlayback,
    });
  };
  return (
    <>
      {trackAdded && <TrackAdded data={trackAddedData} />}
      <div className="container">
        <div className="field">
          <label className="label">Search</label>
          <div className="control">
            <input className="input" type="text" placeholder="Typing..." />
          </div>
        </div>
        <TrackList tracks={testList.concat(null)} />
      </div>
    </>
  );
}

export default App;
