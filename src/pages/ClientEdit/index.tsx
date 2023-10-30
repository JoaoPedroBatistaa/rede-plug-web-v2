import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderEditClients";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getClientById, updateClientInLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function UpdateFoam() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const id = Array.isArray(router.query.id)
    ? router.query.id[0]
    : router.query.id;

  let userId: string | null;
  if (typeof window !== "undefined") {
    userId = window.localStorage.getItem("userId");
  }

  // State to hold the current foam
  const [foam, setFoam] = useState<any | null>(null);

  // fetch the foam data on component mount using the id from router
  useEffect(() => {
    console.log("ID:", id); // Log do ID
    console.log("UserID:", userId); // Log do UserID

    if (id && userId) {
      getClientById(id, userId).then((fetchedFoam) => {
        console.log("Dados recebidos:", fetchedFoam); // Log dos dados fetchedFoam
        setFoam(fetchedFoam);
      });
    } else {
      toast.error(
        "Erro: ID de usuário não encontrado. Faça o login novamente."
      );
    }
  }, [id]);

  // update the state when input fields change
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    let newValue = event.target.value;

    // Se o ID for "valorMetro", substituímos a vírgula por um ponto
    if (event.target.id === "valorMetro") {
      newValue = newValue.replace(/,/g, ".");
    }

    setFoam({
      ...foam,
      [event.target.id]: newValue,
    });
  };

  const handleButtonFinish = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!userId || !id) {
      toast.error("Erro: ID de usuário ou ID de produto não encontrado.");
      return;
    }

    if (foam?.CSTICMS && foam?.CSTICMS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (ICMS)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (foam?.CSTIPI && foam?.CSTIPI.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (IPI)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (foam?.CSTCOFINS && foam?.CSTCOFINS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (COFINS)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (foam?.CSTPIS && foam?.CSTPIS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (PIS)' deve conter exatamente 2 caracteres."
      );
      return;
    }

    try {
      await updateClientInLogin(foam, id, userId);
      toast.success("Cliente Atualizado!");
    } catch (e) {
      toast.error("Erro ao atualizar produto.");
    }

    setTimeout(() => {
      router.push("/Cliente");
    }, 500);
  };

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  return (
    <>
      <Head>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
      </Head>

      <HeaderNewProduct></HeaderNewProduct>
      <ToastContainer />
      <div className={styles.Container} onClick={handleOpenMenuDiv}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Atualizar Cliente</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <span className={styles.buttonText}>Atualizar Cliente</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as novas credenciais do seu Cliente
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CPF/CNPJ</p>
              <input
                id="cpf"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.cpf || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input
                id="NomeCompleto"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.NomeCompleto || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Email</p>
              <input
                id="email"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.email || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Telefone</p>
              <input
                id="Telefone"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.Telefone || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Cidade</p>
              <input
                id="cidade"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.cidade || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Bairro</p>
              <input
                id="bairro"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.bairro || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Numero</p>
              <input
                id="numero"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.numero || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Endereço</p>
              <textarea
                className={styles.Field}
                id="venue"
                value={foam?.venue || ""}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CEP</p>
              <input
                id="cep"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.cep || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Estado</p>
              <select
                id="estado"
                className={styles.SelectField}
                value={foam?.estado || ""}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Selecione seu estado
                </option>
                <option value="Acre">Acre</option>
                <option value="Alagoas">Alagoas</option>
                <option value="Amapá">Amapá</option>
                <option value="Amazonas">Amazonas</option>
                <option value="Bahia">Bahia</option>
                <option value="Ceará">Ceará</option>
                <option value="Distrito Federal">Distrito Federal</option>
                <option value="Espírito Santo">Espírito Santo</option>
                <option value="Goiás">Goiás</option>
                <option value="Maranhão">Maranhão</option>
                <option value="Mato Grosso">Mato Grosso</option>
                <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
                <option value="Minas Gerais">Minas Gerais</option>
                <option value="Pará">Pará</option>
                <option value="Paraíba">Paraíba</option>
                <option value="Paraná">Paraná</option>
                <option value="Pernambuco">Pernambuco</option>
                <option value="Piauí">Piauí</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Rio Grande do Norte">Rio Grande do Norte</option>
                <option value="Rio Grande do Sul">Rio Grande do Sul</option>
                <option value="Rondônia">Rondônia</option>
                <option value="Roraima">Roraima</option>
                <option value="Santa Catarina">Santa Catarina</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Sergipe">Sergipe</option>
                <option value="Tocantins">Tocantins</option>
              </select>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Numero</p>
              <input
                id="numero"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.numero || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Bairro</p>
              <input
                id="bairro"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.bairro || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Complemento</p>
              <input
                id="complemento"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.complemento || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Finanças</p>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as suas informações sobre impostos e afins...
          </p>

          <div className={styles.InputContainer}>
            {/* ICMS */}
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Origem (ICMS)</p>
              <input
                id="orig"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.orig || ""}
                maxLength={1} // Restringe a entrada para aceitar apenas um caractere
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    ["0", "1", "2", "3", "4", "5", "6", "7", "8", ""].includes(
                      val
                    )
                  ) {
                    handleChange(e);
                  }
                }}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (ICMS)
              </p>
              <input
                id="CSTICMS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.CSTICMS || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2 && /^[0-9]+$/.test(val)) {
                    handleChange(e);
                  }
                }}
                maxLength={2}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Modalidade da Base de Cálculo (ICMS)
              </p>
              <input
                id="modBC"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.modBC || ""}
                maxLength={1} // Restringe a entrada para aceitar apenas um caractere
                onChange={(e) => {
                  const val = e.target.value;
                  if (["0", "1", "2", "3"].includes(val) || val === "") {
                    handleChange(e);
                  }
                }}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Valor da Base de Cálculo (ICMS)
              </p>
              <input
                id="vBC"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vBC || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota do ICMS</p>
              <input
                id="pICMS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.pICMS || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor do ICMS</p>
              <input
                id="vICMS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vICMS || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota do FCP</p>
              <input
                id="pFCP"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.pFCP || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor do FCP</p>
              <input
                id="vFCP"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vFCP || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            {/* IPI */}
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Enquadramento Legal (IPI)
              </p>
              <input
                id="cEnq"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.cEnq || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (IPI)
              </p>
              <input
                id="CSTIPI"
                type="text"
                maxLength={2}
                className={styles.Field}
                placeholder=""
                value={foam?.CSTIPI || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2 && /^[0-9]+$/.test(val)) {
                    handleChange(e);
                  }
                }}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            {/* PIS */}
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (PIS)
              </p>
              <input
                id="CSTPIS"
                type="text"
                maxLength={2}
                className={styles.Field}
                placeholder=""
                value={foam?.CSTPIS || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2 && /^[0-9]+$/.test(val)) {
                    handleChange(e);
                  }
                }}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Valor da Base de Cálculo (PIS)
              </p>
              <input
                id="vBCPIS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vBCPIS || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota PIS (%)</p>
              <input
                id="pPIS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.pPIS || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor PIS</p>
              <input
                id="vPIS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vPIS || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            {/* COFINS */}
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (COFINS)
              </p>
              <input
                id="CSTCOFINS"
                type="text"
                maxLength={2}
                className={styles.Field}
                placeholder=""
                value={foam?.CSTCOFINS || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2 && /^[0-9]+$/.test(val)) {
                    handleChange(e);
                  }
                }}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Valor da Base de Cálculo (COFINS)
              </p>
              <input
                id="vBCCOFINS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vBCCOFINS || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota COFINS (%)</p>
              <input
                id="pCOFINS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.pCOFINS || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor COFINS</p>
              <input
                id="vCOFINS"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.vCOFINS || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Total Maxx 2023, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
