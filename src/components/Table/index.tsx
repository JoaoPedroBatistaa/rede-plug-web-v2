import React, { useEffect, useState } from 'react'
import styles from '../../styles/Table.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

import { collection, db, getDoc, doc } from '../../../firebase';
import { GetServerSidePropsContext } from 'next';
import { getDocs } from 'firebase/firestore';

interface Order {
  id: string;

  NumeroPedido: string;
  Telefone: string;
  nomeCompleto: string;
  Ativo: boolean;
  Entrega: string;
  dataCadastro: string;
  formaPagamento: string;
  valorTotal: string;
}


export default function Table() {

  const [teste, setTeste] = useState<Order[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dbCollection = collection(db, 'Orders');
      const budgetSnapshot = await getDocs(dbCollection);
      const budgetList = budgetSnapshot.docs.map((doc) => {
        const data = doc.data();
        const budget: Order = {
          id: doc.id,
          NumeroPedido: data.NumeroPedido,
          Telefone: data.Telefone,
          nomeCompleto: data.nomeCompleto,
          Ativo: data.Ativo,
          Entrega: data.Entrega,
          dataCadastro: data.dataCadastro,
          formaPagamento: data.formaPagamento,
          valorTotal: data.valorTotal,
        };
        return budget;
      });
      setTeste(budgetList);
      console.log(budgetList);
    }
    fetchData();
  }, []);

  const data = [
    { numeroPedido: "1231", numeroTelefone: '(11) 99999-9999', cliente: "Cliente A", situacao: "Ativo", prazoEntrega: "10/05/2023", dataCadastro: "05/05/2023", valorTotal: "R$ 100,00" },
    { numeroPedido: "4567", numeroTelefone: '(11) 99999-9999', cliente: "Cliente B", situacao: "Inativo", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
    { numeroPedido: "4562", numeroTelefone: '(11) 99999-9999', cliente: "Cliente B", situacao: "Ativo", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
    { numeroPedido: "4561", numeroTelefone: '(11) 99999-9999', cliente: "Cliente B", situacao: "Ativo", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
    { numeroPedido: "4563", numeroTelefone: '(11) 99999-9999', cliente: "Cliente B", situacao: "Ativo", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
    { numeroPedido: "4568", numeroTelefone: '(11) 99999-9999', cliente: "Cliente B", situacao: "Inativo", prazoEntrega: "15/05/2023", dataCadastro: "08/05/2023", valorTotal: "R$ 150,00" },
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
    <div className={styles.tableContianer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
     
            <th>Nº Pedido</th>
            <th>CLIENTE</th>
            <th>SITUAÇÃO</th>
            <th>PRAZO DE ENTREGA</th>
            <th>DATA DE CADASTRO</th>
            <th>VALOR TOTAL</th>
          </tr>
        </thead>
        <Link href='/ViewOrderData'>
          <tbody>
            {teste.map((item, index) => (
              <tr
                className={styles.budgetItem}
                key={item.id}
                onClick={() => {
                  localStorage.setItem('selectedId', item.id);
                }}
              >
                <td>
                  <img src="./More.png" width={5} height={20} className={styles.MarginRight} />
                </td>
                <td className={styles.td}>
                  <b>#{item.NumeroPedido}</b>
                </td>
                <td className={styles.td}>
                  <b>{item.nomeCompleto}</b><br />
                  <span className={styles.diasUteis}> {item.Telefone}</span>
                </td>
                <td className={styles.td}>
                  <span className={item.Ativo == true ? styles.badge : styles.badgeInativo}>
                    {item.Ativo ?
                      <img src="./circleBlue.png" width={6} height={6} className={styles.marginRight8} /> :
                      <img src="./circleRed.png" width={6} height={6} className={styles.marginRight8} />}
                    {item.Ativo ? 'Ativo' : 'Inativo'}
                  </span>
                  <br />
                  <span className={styles.dataCadastro}>
                    Data de cadastro:{item.dataCadastro}
                  </span>
                </td>
                <td className={styles.td}>
                  {item.Entrega}<br />
                  <span className={styles.diasUteis}>15 dias Utéis</span>
                </td>
                  <td className={styles.td}>
                  {item.dataCadastro}<br />
                  <span className={styles.diasUteis}>{item.nomeCompleto}</span>
                </td>
                <td className={styles.td}>
                  {item.valorTotal}
                  <br />
                  <span className={styles.diasUteis}>À Vista</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Link>
      </table>
      <div className={styles.RodapeContainer}>
        <div className={styles.RodapeContinaerLeft}>
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
        </div>

        <div className={styles.RodapeContinaerRight}>

          <div className={styles.RodapePaginacaoContador}>
            <FontAwesomeIcon icon={faAngleLeft} className={styles.RodapePaginacaoIcone}></FontAwesomeIcon>
          </div>
          <div className={styles.RodapePaginacaoContadorDestaque}>1</div>
          <div className={styles.RodapePaginacaoContadorSemBorda}>2</div>
          <div className={styles.RodapePaginacaoContadorSemBorda}>3</div>
          <div className={styles.RodapePaginacaoContadorSemBorda}>4</div>
          <div className={styles.RodapePaginacaoContadorSemBorda}>5</div>
          <div className={styles.RodapePaginacaoContador}>
            <FontAwesomeIcon icon={faAngleRight}
              className={styles.RodapePaginacaoIcone} ></FontAwesomeIcon>
          </div>

          {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              className={`pagination-item ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))} */}
        </div>

      </div>
    </div>
  )
}
