import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewProduct";
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
    if (id && userId) {
      getClientById(id, userId).then((fetchedFoam) => setFoam(fetchedFoam));
    } else {
      toast.error(
        "Erro: ID de usuário não encontrado. Faça o login novamente."
      );
    }
  }, [id]);

  // update the state when input fields change
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let newValue = event.target.value;

    // Se o ID for "codigo", substituímos a vírgula por um ponto
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
                id="codigo"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.cpf || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Nome completo</p>
              <input
                id="margemLucro"
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
                id="margemLucro"
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
                id="valorMetro"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.Telefone || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Cidade</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.cidade || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Endereço</p>
              <textarea
                className={styles.Field}
                id="descricao"
                value={foam?.venue || ""}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className={styles.InputContainer}>
            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>CEP</p>
              <input
                id="valorMetro"
                type="number"
                className={styles.Field}
                placeholder=""
                value={foam?.cep || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Estado</p>
              <input
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.estado || ""}
                onChange={handleChange}
              />
            </div>

            <div className={styles.InputField}>
              <p className={styles.FieldLabel}>Numero</p>
              <input
                id="valorPerda"
                type="text"
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
                id="valorMetro"
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
                id="valorPerda"
                type="text"
                className={styles.Field}
                placeholder=""
                value={foam?.complemento || ""}
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
