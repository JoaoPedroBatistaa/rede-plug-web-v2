import { useState } from "react";
import styles from "../../styles/InputSearch.module.scss";

interface SearchInput {
  searchTextFn(): void;
}

const SearchInput = () => {
  const [searchText, setSearchText] = useState("");
  const handleInputChange = (event: any) => {
    setSearchText(event.target.value);
  };
  return (
    <div className={styles.searchContainer}>
      <img src="/search.png" alt="" />
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
