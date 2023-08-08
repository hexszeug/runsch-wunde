import TrackAdded from './TrackAdded';
import TrackList from './TrackList';
import { testList, testPlayback } from './testData';

function App() {
  return (
    <>
      <TrackAdded
        track={testList[0]}
        queue={testList}
        playback={testPlayback}
      />
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
