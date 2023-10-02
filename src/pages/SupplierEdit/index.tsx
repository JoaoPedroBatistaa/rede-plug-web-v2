import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewProduct";
import { MouseEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSupplierById, updateSupplierInLogin } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

export default function SupplierEdit() {
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

  // fetch the foam data on component mount using the id from router
  useEffect(() => {
    if (id && userId) {
      getSupplierById(id, userId).then((fetchedFoam) => setFoam(fetchedFoam));
    } else {
      toast.error(
        "Erro: ID de usuário não encontrado. Faça o login novamente."
      );
    }
  }, [id]);

  const [foam, setFoam] = useState({
    CNPJ: "",
    reason: "",
    name: "",
    telefone: "",
    venue: "",
    cep: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    setFoam((prevFoam) => ({
      ...prevFoam,
      [id]: value,
    }));
  };

  const handleButtonFinish = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!userId || !id) {
      toast.error("Erro: ID de usuário ou ID de produto não encontrado.");
      return;
    }

    try {
      await updateSupplierInLogin(foam, id, userId);
      toast.success("Fornecedor Atualizado!");
    } catch (e) {
      toast.error("Erro ao atualizar produto.");
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
            <p className={styles.BudgetTitle}>Atualizar Fornecedor</p>
            <div className={styles.BudgetHeadS}>
              <button
                className={styles.FinishButton}
                onClick={handleButtonFinish}
              >
                <span className={styles.buttonText}>Atualizar Fornecedor</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as novas credenciais do seu Fornecedor
          </p>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CNPJ</p>
              <input
                id="CNPJ"
                type="number"
                className={styles.Field}
                value={foam.CNPJ}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Razão social</p>
              <input
                id="reason"
                type="text"
                className={styles.Field}
                value={foam.reason}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome do representante</p>
              <input
                id="name"
                type="text"
                className={styles.Field}
                value={foam.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Telefone</p>
              <input
                id="telefone"
                type="text"
                className={styles.Field}
                value={foam.telefone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Endereço</p>
              <input
                id="venue"
                type="text"
                className={styles.Field}
                value={foam.venue}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CEP</p>
              <input
                id="cep"
                type="text"
                className={styles.Field}
                value={foam.cep}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Cidade</p>
              <input
                id="cidade"
                type="text"
                className={styles.Field}
                value={foam.cidade}
                onChange={handleChange}
              />
            </div>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Estado</p>
              <input
                id="estado"
                type="text"
                className={styles.Field}
                value={foam.estado}
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
