import styles from "../../styles/InputSearchList.module.scss";
import { IInputSearchList } from "./type";

const SearchInputList = ({ handleSearchChange }: IInputSearchList) => {
  return (
    <div className={styles.searchContainer}>
      <img src="/search.png" alt="" />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Busque por Clientes..."
        onChange={handleSearchChange}
        //  value={searchValue}
      />
    </div>
  );
};

export default SearchInputList;
