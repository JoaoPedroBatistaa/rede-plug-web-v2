import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from '../../styles/InputSearchList.module.scss';

const SearchInputList = () => {
  return (
    <div className={styles.searchContainer}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input type="text" className={styles.searchInput} placeholder="Busque por cliente, data de cadastro, situação..." />
    
    </div>
  );
};

export default SearchInputList;