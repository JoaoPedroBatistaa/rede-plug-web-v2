import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addSupplierToLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function AddSupplier() {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/Login");
    }
  }, []);

  const { openMenu, setOpenMenu } = useMenu();

  const [CNPJ, setCNPJ] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [venue, setVenue] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [telefone, setTelefone] = useState<string | null>(null);
  const [cep, setCep] = useState<string | null>(null);
  const [cidade, setCidade] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);

  const handleButtonFinish = async (event: any) => {
    event.preventDefault();

    let userId = localStorage.getItem("userId");

    const foam = {
      CNPJ,
      reason,
      venue,
      name,
      telefone,
      cep,
      cidade,
      estado,
    };

    try {
      // Substitua 'id_do_login' pelo id do login onde você quer adicionar o paspatur
      await addSupplierToLogin(foam, userId);
      toast.success("Fornecedor Cadastrado!");
    } catch (e) {
      toast.error("Erro ao cadastrar fornecedor.");
    }

    setTimeout(() => {
      router.push("/Supplier");
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
            <p className={styles.BudgetTitle}>Fornecedor</p>
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
                <span className={styles.buttonText}>Cadastrar Fornecedor</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credencias do seu Fornecedor
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CNPJ</p>
              <input
                id="codigo"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setCNPJ(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Razão Social</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome do representante</p>
              <input
                id="margemLucro"
                type="text"
                className={styles.Field}
                placeholder=""
                onChange={(e) => setName(e.target.value)}
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
              <p className={styles.FieldLabel}>Endereço</p>
              <textarea
                className={styles.Field}
                id="text"
                name=""
                onChange={(e) => setVenue(e.target.value)}
              ></textarea>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CEP</p>
              <input
                className={styles.Field}
                id="text"
                name=""
                onChange={(e) => setCep(e.target.value)}
              ></input>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Cidade</p>
              <input
                className={styles.Field}
                id="text"
                name=""
                onChange={(e) => setCidade(e.target.value)}
              ></input>
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Estado</p>
              <input
                className={styles.Field}
                id="text"
                name=""
                onChange={(e) => setEstado(e.target.value)}
              ></input>
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
