import TrackAdded from './TrackAdded';
import TrackList from './TrackList';
import testData from './testData';

function App() {
  return (
    <>
      <TrackAdded track={testData[0]} />
      <div className="container">
        <div className="field">
          <label className="label">Search</label>
          <div className="control">
            <input className="input" type="text" placeholder="Typing..." />
          </div>
        </div>
        <TrackList tracks={testData.concat(null)} />
      </div>
    </>
  );
}

export default App;
