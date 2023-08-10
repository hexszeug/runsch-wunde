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
          <span>Connect to</span>
          <img
            className="ml-2"
            src={spotifyLogo}
            alt="Spotify"
            draggable="false"
            width="120px"
          />
        </button>
      </div>
    </div>
  );
};

export default Login;
