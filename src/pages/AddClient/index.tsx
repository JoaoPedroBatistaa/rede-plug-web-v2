import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderEditClients";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addClientToLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

type FoamType = {
  [key: string]: string | null;
  cpf: string | null;
  NomeCompleto: string;
  Telefone: string | null;
  email: string | null;
  bairro: string | null;
  cep: string | null;
  venue: string | null;
  estado: string | null;
  cidade: string | null;
  numero: string | null;
  complemento: string | null;

  // ICMS
  orig: string | null;
  CSTICMS: string | null;
  modBC: string | null;
  vBC: string | null;
  pICMS: string | null;
  vICMS: string | null;
  pFCP: string | null;
  vFCP: string | null;

  // IPI
  cEnq: string | null;
  CSTIPI: string | null;

  // PIS
  CSTPIS: string | null;
  vBCPIS: string | null;
  pPIS: string | null;
  vPIS: string | null;

  // COFINS
  CSTCOFINS: string | null;
  vBCCOFINS: string | null;
  pCOFINS: string | null;
  vCOFINS: string | null;
};

export default function ProductFoam() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const [cpf, setCpf] = useState<string | null>(null);
  const [NomeCompleto, setNomeCompleto] = useState("");
  const [Telefone, setTelefone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bairro, setBairro] = useState<string | null>(null);
  const [cep, setCep] = useState<string | null>(null);
  const [venue, setVenue] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [numero, setNumero] = useState<string | null>(null);
  const [complemento, setComplemento] = useState<string | null>(null);

  // ICMS
  const [orig, setOrig] = useState("");
  const [CSTICMS, setCST] = useState("");
  const [modBC, setModBC] = useState("");
  const [vBC, setVBC] = useState("");
  const [pICMS, setPICMS] = useState("");
  const [vICMS, setVICMS] = useState("");
  const [pFCP, setPFCP] = useState("");
  const [vFCP, setVFCP] = useState("");

  // IPI
  const [cEnq, setCEnq] = useState("");
  const [CSTIPI, setCSTIPI] = useState("");

  // PIS
  const [CSTPIS, setCSTPIS] = useState("");
  const [vBCPIS, setVBCPIS] = useState("");
  const [pPIS, setPPIS] = useState("");
  const [vPIS, setVPIS] = useState("");

  // COFINS
  const [CSTCOFINS, setCSTCOFINS] = useState("");
  const [vBCCOFINS, setVBCCOFINS] = useState("");
  const [pCOFINS, setPCOFINS] = useState("");
  const [vCOFINS, setVCOFINS] = useState("");

  const handleButtonFinish = async (event: any) => {
    event.preventDefault();

    let userId = localStorage.getItem("userId");

    const foam: FoamType = {
      cpf: cpf ? cpf.replace(/[^\d]/g, "") : null,
      NomeCompleto,
      Telefone: Telefone ? Telefone.replace(/[^\d]/g, "") : null,
      email,
      bairro,
      cep: cep ? cep.replace(/[^\d]/g, "") : null,
      venue,
      estado,
      cidade,
      numero: numero ? numero.replace(/[^\d]/g, "") : null,
      complemento,
      orig,
      CSTICMS,
      modBC,
      vBC,
      pICMS,
      vICMS,
      pFCP,
      vFCP,
      cEnq,
      CSTIPI,
      CSTPIS,
      vBCPIS,
      pPIS,
      vPIS,
      CSTCOFINS,
      vBCCOFINS,
      pCOFINS,
      vCOFINS,
    };

    for (let key in foam) {
      if (foam[key]) {
        foam[key] = (foam[key] as string).trim();
      }
    }

    const optionalFields = [
      "orig",
      "CSTICMS",
      "modBC",
      "vBC",
      "pICMS",
      "vICMS",
      "pFCP",
      "vFCP",
      "cEnq",
      "CSTIPI",
      "CSTPIS",
      "vBCPIS",
      "pPIS",
      "vPIS",
      "CSTCOFINS",
      "vBCCOFINS",
      "pCOFINS",
      "vCOFINS",
    ];

    const isFieldMissing = Object.entries(foam).some(
      ([key, value]) => !value && !optionalFields.includes(key)
    );

    if (isFieldMissing) {
      toast.error(
        "Por favor, preencha todos os campos antes de salvar. Apenas campos da área Finanças podem ficar em branco"
      );
      return;
    }

    if (CSTICMS.length >= 1 && CSTICMS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (ICMS)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (CSTIPI.length >= 1 && CSTIPI.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (IPI)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (CSTCOFINS.length >= 1 && CSTCOFINS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (COFINS)' deve conter exatamente 2 caracteres."
      );
      return;
    }
    if (CSTPIS.length >= 1 && CSTPIS.length !== 2) {
      toast.error(
        "O campo 'Código de Situação Tributária (PIS)' deve conter exatamente 2 caracteres."
      );
      return;
    }

    try {
      await addClientToLogin(foam, userId);
      toast.success("Cliente Cadastrado!");
    } catch (e) {
      toast.error("Erro ao cadastrar cliente.");
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
            <p className={styles.BudgetTitle}>Cliente</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar cliente</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credencias do seu Cliente
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CPF/CNPJ</p>
              <input
                id="codigo"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setNomeCompleto(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Telefone</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Email</p>
              <input
                id="valorMetro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Cidade</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Bairro</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setBairro(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Numero</p>
              <input
                id="valorPerda"
                type="number"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Endereço</p>
              <textarea
                className={styles.Field}
                id="descricao"
                name=""
                onChange={(e) => setVenue(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Estado</p>
              <select
                id="valorMetro"
                className={styles.SelectField}
                onChange={(e) => setEstado(e.target.value)}
                defaultValue=""
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
              <p className={styles.FieldLabel}>Cep</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setCep(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Complemento</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setComplemento(e.target.value)}
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
                type="number"
                className={styles.Field}
                value={orig}
                maxLength={1} // Restringe a entrada para aceitar apenas um caractere
                onChange={(e) => {
                  const val = e.target.value;
                  if (
                    ["0", "1", "2", "3", "4", "5", "6", "7", "8", ""].includes(
                      val
                    )
                  ) {
                    setOrig(e.target.value);
                  }
                }}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (ICMS)
              </p>
              <input
                id="CST"
                type="number"
                maxLength={2}
                className={styles.Field}
                value={CSTICMS}
                onChange={(e) => setCST(e.target.value)}
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
                value={modBC}
                maxLength={1} // Restringe a entrada para aceitar apenas um caractere
                onChange={(e) => {
                  const val = e.target.value;
                  if (["0", "1", "2", "3"].includes(val) || val === "") {
                    setModBC(val);
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
                value={vBC}
                onChange={(e) => setVBC(e.target.value)}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota do ICMS</p>
              <input
                id="pICMS"
                type="text"
                className={styles.Field}
                value={pICMS}
                onChange={(e) => setPICMS(e.target.value)}
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
                value={vICMS}
                onChange={(e) => setVICMS(e.target.value)}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota do FCP</p>
              <input
                id="pFCP"
                type="text"
                className={styles.Field}
                value={pFCP}
                onChange={(e) => setPFCP(e.target.value)}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor do FCP</p>
              <input
                id="vFCP"
                type="text"
                className={styles.Field}
                value={vFCP}
                onChange={(e) => setVFCP(e.target.value)}
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
                value={cEnq}
                onChange={(e) => setCEnq(e.target.value)}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>
                Código de Situação Tributária (IPI)
              </p>
              <input
                id="CSTIPI"
                type="number"
                maxLength={2}
                className={styles.Field}
                value={CSTIPI}
                onChange={(e) => setCSTIPI(e.target.value)}
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
                type="number"
                maxLength={2}
                className={styles.Field}
                value={CSTPIS}
                onChange={(e) => setCSTPIS(e.target.value)}
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
                value={vBCPIS}
                onChange={(e) => setVBCPIS(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota PIS (%)</p>
              <input
                id="pPIS"
                type="text"
                className={styles.Field}
                value={pPIS}
                onChange={(e) => setPPIS(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor PIS</p>
              <input
                id="vPIS"
                type="text"
                className={styles.Field}
                value={vPIS}
                onChange={(e) => setVPIS(e.target.value)}
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
                type="number"
                maxLength={2}
                className={styles.Field}
                value={CSTCOFINS}
                onChange={(e) => setCSTCOFINS(e.target.value)}
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
                value={vBCCOFINS}
                onChange={(e) => setVBCCOFINS(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Alíquota COFINS (%)</p>
              <input
                id="pCOFINS"
                type="text"
                className={styles.Field}
                value={pCOFINS}
                onChange={(e) => setPCOFINS(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Valor COFINS</p>
              <input
                id="vCOFINS"
                type="text"
                className={styles.Field}
                value={vCOFINS}
                onChange={(e) => setVCOFINS(e.target.value)}
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
