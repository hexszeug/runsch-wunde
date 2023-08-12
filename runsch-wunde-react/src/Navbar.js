import logoBlack from './assets/q-logo_black.png';

const Navbar = () => {
  return (
    <header>
      <nav className="level">
        <div className="level-item">
          <figure className="image is-64x64">
            <img
              className="no-select"
              src={logoBlack}
              alt="Q"
              draggable="false"
            />
          </figure>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
