import Head from 'next/head';
import styles from '../../styles/ViewOrderBudget.module.scss';
import { useRouter } from 'next/router';

import HeaderOrder from '@/components/HeaderOrder';
import SideMenuHome from '@/components/SideMenuHome';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

export default function ViewOrderBudget() {

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState('opcao1');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>


      <div className={styles.Container}>
        <SideMenuHome activeRoute={router.pathname} ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderOrder></HeaderOrder>

          <div className={styles.OrderDataContainer}>

            <div className={styles.BudgetHead}>
              <div className={styles.Nav}>
                <Link href='ViewOrderData'>
                  <p className={styles.NavItem}>Dados do cliente</p>
                </Link>

                <Link href='ViewOrderShip'>
                  <p className={styles.NavItem}>Endereço</p>
                </Link>

                <Link href='ViewOrderBudget'>
                  <div>
                    <p className={`${styles.NavItem} ${styles.active}`}>Orçamento</p>
                    <div className={styles.NavItemBar}></div>
                  </div>
                </Link>
              </div>

              <div className={styles.BudgetHeadO}>
                <p className={styles.OrderTotalValue}>Valor total:</p>
                <p className={styles.OrderValue}>R$1350,00</p>
              </div>
            </div>

            <div className={styles.linhaOrder}></div>

            <div className={styles.OrderData}>
              <div className={styles.OrderAll}>

                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Resumo do orçamento</p>

                  <div>
                    <p className={styles.ResName}>Tamanho</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>120cm</p>
                      <p className={styles.ResValue}>-</p>
                      <p className={styles.ResValue}>90 cm</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Impressão</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                      <p className={styles.ResValue}>-</p>
                      <p className={styles.ResValue}>PAPEL</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Perfil</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>4402</p>
                      <p className={styles.ResValue}>-</p>
                      <p className={styles.ResValue}>10cm</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Vidro</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                      <p className={styles.ResValue}>-</p>
                      <p className={styles.ResValue}>10cm</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Foam</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Paspatur</p>
                    <div>
                      <div className={styles.OrderResValue}>
                        <p className={styles.ResValue}>SIM</p>
                        <p className={styles.ResValue}>-</p>
                        <p className={styles.ResValue}>4052</p>
                      </div>

                      <p className={styles.ResValue}>10cmX10cmX10cmX10cm</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Colagem</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Impressão</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Instalação</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>SIM</p>
                      <p className={styles.ResValue}>-</p>
                      <p className={styles.ResValue}>1R$82,00</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Entrega</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>Retirada na loja</p>
                    </div>
                  </div>

                </div>

                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Pagamentos e prazos</p>

                  <div>
                    <p className={styles.ResName}>Mão de obra externa</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>R$100,00</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Forma de pagamento</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>À vista</p>
                    </div>
                  </div>

                  <div>
                    <p className={styles.ResName}>Prazo para entrega</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>27/05/2023</p>
                    </div>
                  </div>

                  <div className={styles.OrderNotes}>
                    <p className={styles.ResName}>Observação</p>
                    <div className={styles.OrderResValue}>
                      <p className={styles.ResValue}>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour</p>
                    </div>
                  </div>
                </div>

                <div className={styles.OrderRes}>
                  <p className={styles.ResTitle}>Valor total</p>
                  <div>
                    <p className={styles.ResTotal}>R$1.350,00</p>
                  </div>
                </div>
              </div>

              <div className={styles.Cta}>
                <div className={styles.WhatsButton}>
                  <img className={styles.WhatsImg} src="./Wpp.png" alt="" />
                  <p className={styles.WhatsText}>ENVIAR POR WHATSAPP</p>
                </div>

                <div className={styles.PdfButton}>
                  <img className={styles.WhatsImg} src="./PdfIcon.png" alt="" />
                  <p className={styles.PdfText}>GERAR PDF</p>
                </div>
              </div>

            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>

      </div >
    </>
  )
}