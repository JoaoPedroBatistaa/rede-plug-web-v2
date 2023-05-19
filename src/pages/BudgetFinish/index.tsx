import Head from 'next/head';
import styles from '../../styles/BudgetFinish.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useState } from 'react';

export default function BudgetFinish() {

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

      <HeaderBudget></HeaderBudget>
      <div className={styles.Container}>
        <SideMenuBudget activeRoute={router.pathname} ></SideMenuBudget>

        <div className={styles.BudgetContainer}>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Efetivar Orçamento</p>
          </div>

          <div className={styles.BudgetData}>
            <div className={styles.PessoalData}>
              <p className={styles.BudgetSubTitle}>Dados pessoais</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tipo de pessoa</p>
                  <select className={styles.SelectFieldPerson} value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="opcao1" selected={selectedOption === 'opcao1'}>
                      FÍSICA
                    </option>
                    <option value="opcao2" selected={selectedOption === 'opcao2'}>
                      JURÍDICA
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome completo</p>
                  <input type="text" className={styles.FieldSave} placeholder='JOSÉ ALBERTO SANTIAGO' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>CPF</p>
                  <input type="text" className={styles.FieldSave} placeholder='111111111-11' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Telefone</p>
                  <input type="tel" className={styles.FieldSave} placeholder='(61) 99999-9999' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Email</p>
                  <input type="mail" className={styles.FieldSave} placeholder='josealberto@gmail.com' />
                </div>
              </div>
            </div>

            <div className={styles.linhaData}></div>

            <div className={styles.AdressData}>
              <p className={styles.BudgetSubTitle}>Endereço</p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>CEP</p>
                  <input type="text" className={styles.FieldSmall} placeholder='99999-999' />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Endereço *</p>
                  <input type="text" className={styles.FieldSave} placeholder='Rua X Num 9' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Número *</p>
                  <input type="text" className={styles.FieldSmall} placeholder='999' />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Complemento</p>
                  <input type="text" className={styles.FieldSave} placeholder='Casa' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Bairro *</p>
                  <input type="text" className={styles.Field} placeholder='Lapa' />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Cidade</p>
                  <input type="text" className={styles.Field} placeholder='São Paulo' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Estado *</p>
                  <input type="text" className={styles.Field} placeholder='São Paulo' />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tipo de entrega</p>
                  <select className={styles.SelectField} value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="opcao1" selected={selectedOption === 'opcao1'}>
                      TRANSPORTADORA
                    </option>
                    <option value="opcao2" selected={selectedOption === 'opcao2'}>
                      SEDEX
                    </option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Valor da entrega</p>
                  <p className={styles.FixedValue}>R$245,30</p>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Necessita de instalação?</p>
                  <select className={styles.SelectField} value={selectedOption}
                    onChange={handleSelectChange}>
                    <option value="opcao1" selected={selectedOption === 'opcao1'}>
                      SIM
                    </option>
                    <option value="opcao2" selected={selectedOption === 'opcao2'}>
                      NÃO
                    </option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Valor da instalação</p>
                  <p className={styles.FixedValue}>R$125,30</p>
                </div>
              </div>


            </div>
          </div>

          <div className={styles.linhaSave}></div>

          <div className={styles.ButtonsFinish}>
            <button className={styles.CancelButton}>Cancelar</button>
            <button className={styles.SaveButton}>Efetivar Orçamento</button>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>

        </div>
      </div >
    </>
  )
}