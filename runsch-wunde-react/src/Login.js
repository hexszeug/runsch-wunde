import { redirectToLogin } from './auth';
import spotifyLogo from './assets/spotify/logos/Spotify_Logo_RGB_White.png';

const Login = () => {
  return (
    <div>
      <div className="buttons is-centered">
        <button
          className="button is-large is-primary"
          onClick={redirectToLogin}
        >
          <span>Mit</span>
          <img
            className="mx-2"
            src={spotifyLogo}
            alt="Spotify"
            draggable="false"
            width="120px"
          />
          <span>verbinden</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
