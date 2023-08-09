import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Search = ({ value, onChange }) => {
  return (
    <div className="field">
      <label className="label is-medium">Wish for a song</label>
      <div className="control has-icons-left">
        <input
          className="input is-medium"
          type="text"
          placeholder="Search"
          value={value}
          onChange={onChange}
        />
        <span className="icon is-left">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
      </div>
    </div>
  );
};

export default Search;
