import React from "react";
import styles from '../../styles/GridComponent.module.scss'

const GridComponent = () => {
  // Dados de exemplo
  const data = [
    { numeroPedido: "123", cliente: "Cliente A", situacao: "Em andamento", prazoEntrega: "10/05/2023", dataCadastro: "05/05/2023", valorTotal: "R$ 100,00" },
    { numeroPedido: "456", cliente: "Cliente B", situacao: "Concluído", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
    // ... adicione mais linhas de dados conforme necessário
  ];

  // Configuração da paginação
  const itemsPerPage = 10; // Itens exibidos por página
  const totalItems = data.length; // Total de resultados
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = React.useState(1);

  // Lógica para exibir os dados da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div>
      <div className={styles.GridContainer}>
        <div className={styles.Row}>
          <div className={styles.ColumnHeader}>Nº do Pedido</div>
          <div className={styles.ColumnHeader}>Cliente</div>
          <div className={styles.ColumnHeader}>Situação</div>
          <div className={styles.ColumnHeader}>Prazo de Entrega</div>
          <div className={styles.ColumnHeader}>Data de Cadastro</div>
          <div className={styles.ColumnHeader}>Valor Total</div>
        </div>
        {currentData.map((item, index) => (
          <div key={index} className={styles.Row}>
            <div className={styles.Column}><img src="./More.png" width={5} height={20} className={styles.MarginRight} />{item.numeroPedido}</div>
            <div className={styles.Column}>{item.cliente}</div>
            <div className={styles.Column}>{item.situacao}</div>
            <div className={styles.Column}>{item.prazoEntrega}</div>
            <div className={styles.Column}>{item.dataCadastro}</div>
            <div className={styles.Column}>{item.valorTotal}</div>
          </div>
        ))}
      </div>
      <div className={styles.RodapeContainer}>
        <div className="pagination-info">
          Exibir
          {/* Exibindo {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems} resultados */}
        </div>
        <div>
          <select className={styles.SelectMax}>
            <option>10</option>
            <option>20</option>
            <option>30</option>
            <option>40</option>
            <option>50</option>
            <option>60</option>
            <option>70</option>
            <option>80</option>
            <option>90</option>
            <option>100</option>
          </select>
        </div>

        <div>
          <b>de 100</b> resultados
        </div>
        {/* <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pagination-item ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div> */}
      </div>
     
    </div>
  );
};

export default GridComponent;
