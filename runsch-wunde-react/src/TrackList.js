const TrackList = ({ tracks }) => {
  return (
    <div>
      {tracks.map((track) => (
        <Track track={track} key={track.id} />
      ))}
    </div>
  );
};

const Track = ({ track }) => {
  return (
    <div className="hoverable p-3 is-clickable is-unselectable">
      <div className="columns is-vcentered is-mobile">
        <div className="column is-narrow">
          <TrackCover track={track} />
        </div>
        <div className="column is-clipped">
          <TrackName track={track} />
          <p className="vcentered">
            <TrackExplicity track={track} />
            <TrackArtists track={track} />
          </p>
        </div>
        <div className="column is-clipped is-hidden-mobile">
          <TrackAlbum track={track} />
          <TrackRelease track={track} />
        </div>
        <div className="column is-narrow is-hidden-touch">
          <TrackDuration track={track} />
        </div>
      </div>
    </div>
  );
};

const TrackCover = ({ track }) => {
  const url = track?.album.images.find((image) => image.width <= 64)?.url;
  return (
    <div className="image is-48x48">
      <img
        className="cover"
        src={url}
        alt={`Album cover of ${track.album.name}`}
        title={track.album.name}
        draggable="false"
      />
    </div>
  );
};

const TrackName = ({ track }) => {
  return (
    <p className="ellipsis" title={track.name}>
      <b>{track.name}</b>
    </p>
  );
};

const TrackExplicity = ({ track }) => {
  if (!track?.explicit) return;
  return (
    <>
      <span className="tag has-background-grey has-text-light" title="Explicit">
        E
      </span>
      <span className="pr-1" />
    </>
  );
};

const TrackArtists = ({ track }) => {
  const artists = track.artists.map((artist) => artist.name).join(', ');
  return (
    <span className="ellipsis" title={artists}>
      {artists}
    </span>
  );
};

const TrackAlbum = ({ track }) => {
  return (
    <p className="ellipsis" title={track.album.name}>
      {track.album.name}
    </p>
  );
};

const TrackRelease = ({ track }) => {
  const year = new Date(track.album.release_date).getFullYear();
  return (
    <p className="has-text-grey ellipsis" title={year}>
      {year}
    </p>
  );
};

const TrackDuration = ({ track }) => {
  const dur = new Date(track.duration_ms);
  return (
    <p className="has-text-right">
      {dur.getMinutes()}:{dur.getSeconds().toString().padStart(2, '0')}
    </p>
  );
};

export default TrackList;
