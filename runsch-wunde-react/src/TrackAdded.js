import { useRef, useState } from 'react';
import { extractColorForBackground } from './colors';

const TrackAdded = ({ track }) => {
  const [backgroundColor, setBackgroundColor] = useState(null);
  const coverRef = useRef(null);
  const handleLoad = (e) => {
    setBackgroundColor(
      `rgb(${extractColorForBackground(e.target).join(', ')})`
    );
  };
  if (!track) return;
  const coverUrl = track.album.images[0].url;
  return (
    <div
      className="full-overlay is-flex is-flex-direction-column is-justify-content-center"
      style={{ backgroundColor }}
    >
      <div className="block">
        <div className="image responsive-cover mx-auto responsive-cover">
          <img
            className="loading hide-alt"
            ref={coverRef}
            crossOrigin="anonymous"
            alt={`Cover of album ${track.album.name}`}
            onLoad={handleLoad}
            src={coverUrl}
            draggable="false"
          />
        </div>
      </div>
      <div className="block p-5">
        <p className="has-text-centered is-size-5 is-size-3-widescreen">
          Added <b>{track.name}</b> to <b>{4}th place</b> in the queue, playing
          in <b>{'15:21'}</b>
        </p>
        <p className="has-text-centered is-size-5 is-size-3-widescreen">
          <b>{track.name}</b> already in <b>{4}th place</b> in the queue,
          playing in <b>{'15:21'}</b>
        </p>
      </div>
    </div>
  );
};

export default TrackAdded;
