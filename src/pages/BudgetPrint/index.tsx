import Head from 'next/head';
import styles from '../../styles/BudgetPrint.module.scss';
import { useRouter } from 'next/router';

import HeaderBudget from '@/components/HeaderBudget';
import SideMenuBudget from '@/components/SideMenuBudget';
import { ChangeEvent, useState } from 'react';

export default function BudgetPrint() {

  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState('opcao1');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      setIsFileSelected(true);
    }
  };


  const handleClick = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);

    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }

    setIsFileSelected(false);
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
            <p className={styles.BudgetTitle}>O pedido necessita de impressão?</p>

            <div className={styles.BudgetHeadS}>
              <div className={styles.TotalValue}>
                <p className={styles.ValueLabel}>Valor total</p>
                <p className={styles.Value}>R$996,00</p>
              </div>

              <button className={styles.FinishButton}>Finalizar Orçamento</button>
            </div>
          </div>

          <p className={styles.Notes}>Informe abaixo se este pedido utilizará impressão</p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Impressão</p>
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
              <p className={styles.FieldLabel}>Tipo de impressão</p>
              <select className={styles.SelectField} value={selectedOption}
                onChange={handleSelectChange}>
                <option value="opcao1" selected={selectedOption === 'opcao1'}>
                  PAPEL
                </option>
                <option value="opcao2" selected={selectedOption === 'opcao2'}>
                  TELA
                </option>
                <option value="opcao3" selected={selectedOption === 'opcao3'}>
                  BANNER
                </option>
              </select>
            </div>
          </div>


          <p className={styles.Preview}>Envio do arquivo de impressão</p>

          <div className={styles.PrintContainer}>
            <img src="/upload.png" className={styles.Upload} />

            <label htmlFor="fileInput" className={styles.LabelUpload}>Arraste e jogue seu anexo aqui ou se preferir  </label>
            <input
              type="file"
              accept=".pdf, .jpeg, .jpg, .png"
              onChange={handleFileChange}
              id="fileInput"
              style={{ display: 'none' }}
            />
            <button className={styles.UploadButton} onClick={handleClick}>Escolher arquivo</button>

            <p className={styles.UploadInfo}>Formatos aceitos PDF, JPEG e PNG</p>
          </div>

          <div className={styles.FileSelected} style={{ display: isFileSelected ? 'flex' : 'none' }}>
            <img src="./file.png" className={styles.FileImg} />

            <div className={styles.FileSelectedStats}>
              <div className={styles.FileSelectedName}>
                {selectedFile && <p className={styles.FileInfo}>{selectedFile.name}</p>}
                <p className={styles.FileInfo}>100%</p>
              </div>

              <div className={styles.FileSelectedBar}></div>
            </div>

            <img src="./trash.png" className={styles.FileDelete} onClick={handleClearFile} />
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>© Total Maxx 2023, todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </>
  )
}