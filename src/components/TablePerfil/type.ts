

type Budget = {
  id: string;
  [key: string]: any;
};


export interface ITableBudgets {
  searchValue: string;
  orderValue: string;
  filterValue: string;

  data: Budget[];
}
