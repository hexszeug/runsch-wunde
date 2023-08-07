import './App.scss';
import TrackList from './TrackList';
import testData from './testData';

function App() {
  return (
    <>
      <div className="container">
        <div className="field">
          <label className="label">Search</label>
          <div className="control">
            <input className="input" type="text" placeholder="Typing..." />
          </div>
        </div>
        <TrackList tracks={testData} />
        <div className="columns">
          <div className="column">
            <button className="button is-primary">Primary</button>
          </div>
          <div className="column">
            <button className="button is-link">Link</button>
          </div>
          <div className="column">
            <button className="button is-info">Info</button>
          </div>
          <div className="column">
            <button className="button is-success">Success</button>
          </div>
          <div className="column">
            <button className="button is-warning">Warning</button>
          </div>
          <div className="column">
            <button className="button is-danger">Danger</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
