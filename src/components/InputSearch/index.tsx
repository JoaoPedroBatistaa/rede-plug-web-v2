import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from '../../styles/InputSearch.module.scss';

const SearchInput = () => {
  return (
    <div className={styles.searchContainer}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input type="text" className={styles.searchInput} placeholder="Digite aqui o que está buscando..." />
    
    </div>
  );
};

export default SearchInput;