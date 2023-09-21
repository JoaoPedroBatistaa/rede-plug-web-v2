import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addClientToLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

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

  const handleButtonFinish = async (event: any) => {
    event.preventDefault();

    let userId = localStorage.getItem("userId");

    const foam = {
      cpf,
      NomeCompleto,
      Telefone,
      email,
      bairro,
      cep,
      venue,
      estado,
      cidade,
      numero,
      complemento,
    };

    try {
      // Substitua 'id_do_login' pelo id do login onde você quer adicionar o paspatur
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
              <input
                id="valorMetro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setEstado(e.target.value)}
              />
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
