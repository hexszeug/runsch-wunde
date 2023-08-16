import React, { useCallback, useEffect, useRef, useState } from 'react';
import { extractColorForBackground } from './colors';
import { msToHMS } from './time';

const OVERLAY_TIME_MS = 7000;

export const useTrackAdded = () => {
  const [{ timeout, track, position, time, isNew }, setData] = useState({});
  const showTrackAdded = useCallback(({ track, queue, playback, isNew }) => {
    const timeout = setTimeout(() => {
      setData({});
    }, OVERLAY_TIME_MS);
    let time = playback.item.duration_ms - playback.progress_ms;
    const position =
      1 +
      queue.toReversed().findIndex(({ uri, duration_ms }) => {
        if (uri === track.uri) return true;
        time += duration_ms;
        return false;
      });
    setData({ timeout, track, position, time, isNew });
  }, []);
  useEffect(() => () => clearTimeout(timeout), [timeout]);
  return [Boolean(timeout), { track, position, time, isNew }, showTrackAdded];
};

const TrackAdded = ({ data: { track, position, time, isNew } }) => {
  const [backgroundColor, setBackgroundColor] = useState(null);
  const coverRef = useRef(null);
  const handleLoad = (e) => {
    setBackgroundColor(
      `rgb(${extractColorForBackground(e.target).join(', ')})`
    );
  };
  if (!track) return;
  return (
    <div
      className="full-overlay is-flex is-flex-direction-column is-justify-content-center"
      style={{ backgroundColor }}
    >
      <div className="block">
        <AlbumCover track={track} onLoad={handleLoad} coverRef={coverRef} />
      </div>
      <div className="block p-5">
        <QueueInfo
          track={track}
          position={position}
          time={time}
          isNew={isNew}
        />
      </div>
    </div>
  );
};

const AlbumCover = ({ track, onLoad, coverRef }) => {
  const coverUrl = track.album.images[0].url;
  return (
    <div className="image responsive-cover mx-auto responsive-cover">
      <img
        className="loading hide-alt"
        ref={coverRef}
        crossOrigin="anonymous"
        alt={`Cover of album ${track.album.name}`}
        onLoad={onLoad}
        src={coverUrl}
        draggable="false"
      />
    </div>
  );
};

const QueueInfo = ({ track, position, time: initialTime, isNew }) => {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    if (time > 0) {
      const timeout = setTimeout(() => {
        setTime(Math.max(time - 1000, 0));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [time, track.uri]);
  return (
    <p className="has-text-centered is-size-5 is-size-3-widescreen">
      {isNew ? (
        <>
          Added <b>{track.name}</b> at <b>position {position}</b> to the queue,
          playing in <b>{msToHMS(time)}</b>
        </>
      ) : (
        <>
          <b>{track.name}</b> already at <b>position {position}</b> in the
          queue, playing in <b>{msToHMS(time)}</b>
        </>
      )}
    </p>
  );
};

export default TrackAdded;
