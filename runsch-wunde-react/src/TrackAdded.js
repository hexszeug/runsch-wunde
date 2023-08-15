import React, { useCallback, useEffect, useRef, useState } from 'react';
import { extractColorForBackground } from './colors';
import { msToHMS } from './time';

const OVERLAY_TIME_MS = 7000;

export const useTrackAdded = () => {
  const [{ timeout, track, queue, playback, isNew }, setData] = useState({});
  const showTrackAdded = useCallback(({ track, queue, playback, isNew }) => {
    const timeout = setTimeout(() => {
      setData({});
    }, OVERLAY_TIME_MS);
    setData({ timeout, track, queue, playback, isNew });
  }, []);
  useEffect(() => () => clearTimeout(timeout), [timeout]);
  return [Boolean(timeout), { track, queue, playback, isNew }, showTrackAdded];
};

const TrackAdded = ({ data: { track, queue, playback, isNew } }) => {
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
          queue={queue}
          playback={playback}
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

const QueueInfo = ({ track, queue, playback, isNew }) => {
  const trackIndex = queue.findIndex(({ uri }) => uri === track.uri);
  const playbackIndex = queue.findIndex(
    ({ uri }) => uri === playback.item?.uri
  );
  const trackPos =
    playbackIndex === -1 ? trackIndex + 1 : playbackIndex - trackIndex;
  const queueTime =
    playbackIndex === -1
      ? 0
      : queue
          .slice(trackIndex + 1, playbackIndex)
          .reduce((sum, { duration_ms }) => sum + duration_ms, 0);
  const playbackTime = !playback.item
    ? 0
    : playback.item.duration_ms - playback.progress_ms;
  const [time, setTime] = useState(queueTime + playbackTime);
  useEffect(() => {
    if (time > 0 && playback.is_playing) {
      const timeout = setTimeout(() => {
        setTime(Math.max(time - 1000, 0));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [time, playback.is_playing, track.uri]);
  return (
    <p className="has-text-centered is-size-5 is-size-3-widescreen">
      {isNew ? (
        <>
          Added <b>{track.name}</b> at <b>position {trackPos}</b> to the queue,
          playing in <b>{msToHMS(time)}</b>
        </>
      ) : trackIndex >= playbackIndex ? (
        <>
          <b>{track.name}</b> has already been played, but you can wish for
          another song.
        </>
      ) : (
        <>
          <b>{track.name}</b> already at <b>position {trackPos}</b> in the
          queue, playing in <b>{msToHMS(time)}</b>
        </>
      )}
    </p>
  );
};

export default TrackAdded;
