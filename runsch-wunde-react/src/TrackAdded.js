import React, { useCallback, useEffect, useRef, useState } from 'react';
import { extractColorForBackground } from './colors';
import { msToHMS } from './time';

const OVERLAY_TIME_MS = 7000;

export const useTrackAdded = () => {
  const [{ timeout, track, queue, playback }, setData] = useState({});
  const showTrackAdded = useCallback(({ track, queue, playback }) => {
    const timeout = setTimeout(() => {
      setData({});
    }, OVERLAY_TIME_MS);
    setData({ timeout, track, queue, playback });
  }, []);
  useEffect(() => () => clearTimeout(timeout), [timeout]);
  return [Boolean(timeout), { track, queue, playback }, showTrackAdded];
};

const TrackAdded = ({ data: { track, queue, playback } }) => {
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
        <QueueInfo track={track} queue={queue} playback={playback} />
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

const QueueInfo = ({ track, queue, playback }) => {
  const queuePos = queue.findIndex(({ uri }) => uri === track.uri) + 1;
  const currentTrackTime = track.duration_ms - playback.progress_ms;
  const queueTime = queue
    .slice(0, queuePos - 1)
    .reduce((sum, { duration_ms }) => sum + duration_ms, 0);
  const [time, setTime] = useState(currentTrackTime + queueTime);
  useEffect(() => {
    if (time > 0) {
      const timeout = setTimeout(() => {
        setTime(Math.max(time - 1000, 0));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [time, track.uri]);
  return queuePos === queue.length ? (
    <p className="has-text-centered is-size-5 is-size-3-widescreen">
      Added <b>{track.name}</b> at <b>position {queuePos}</b> to the queue,
      playing in <b>{msToHMS(time)}</b>
    </p>
  ) : (
    <p className="has-text-centered is-size-5 is-size-3-widescreen">
      <b>{track.name}</b> already at <b>position {queuePos}</b> in the queue,
      playing in <b>{msToHMS(time)}</b>
    </p>
  );
};

export default TrackAdded;
