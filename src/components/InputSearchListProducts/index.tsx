import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../styles/InputSearchList.module.scss";
import { useState } from "react";
import { IInputSearchList } from "./type";

const SearchInputListProducts = ({ handleSearchChange }: IInputSearchList) => {
  return (
    <div className={styles.searchContainer}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Busque por Codigo de Produto..."
        onChange={handleSearchChange}
        //  value={searchValue}
      />
    </div>
  );
};

export default SearchInputListProducts;
