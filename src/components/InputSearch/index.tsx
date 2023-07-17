import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from '../../styles/InputSearch.module.scss';
import { useState } from "react";

interface SearchInput {
  searchTextFn():void;
}

const SearchInput = () => {
  const [searchText, setSearchText] = useState("");
    const handleInputChange = (event:any) => {
    setSearchText(event.target.value);
  };
  return (
    <div className={styles.searchContainer}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input 
        type="text" 
        className={styles.searchInput} 
        value={searchText} 
        placeholder="Digite aqui o que está buscando..." 
        onChange={handleInputChange}
        
        />
    
    </div>
  );
};

export default SearchInput;