import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewUser";
import { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addUserToLogin, db, storage } from "../../../firebase";
import { useMenu } from "../../components/Context/context";

import { collection, getDocs, query, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { uploadToFirebase } from "../../../firebase";

interface AdminUser {
  id: string;
  Login: string;
  Nome: string;
  NomeEmpresa: string;
  Senha: string;
  Tipo: "admin";
  fileDownloadURL: string;
}

export default function AddUser() {
  const router = useRouter();

  const [fileDownloadURL, setFileDownloadURL] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      router.push("/Login");
    }
  }, [userId]);

  const { openMenu, setOpenMenu } = useMenu();

  const [Nome, setNome] = useState("");
  const [Login, setLogin] = useState<string | null>(null);
  const [NomeEmpresa, setNomeEmpresa] = useState<string | null>(null);
  const [Tipo, setTipo] = useState<string | null>(null);
  const [Senha, setSenha] = useState<string | null>(null);

  const handleButtonFinish = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const checkLoginExists = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "Login"), where("Login", "==", Login))
      );
      return !querySnapshot.empty; // Returns true if login exists
    };

    // Check if the login already exists
    if (await checkLoginExists()) {
      toast.error(
        "Este email já foi cadastrado! Por favor, escolha um diferente."
      );
      return;
    }

    // Validation for other fields
    if (Tipo === "vendedor" && !selectedAdminId) {
      toast.error("Por favor, selecione um admin pai para o vendedor.");
      return;
    }

    if (!Nome) {
      toast.error("Por favor, insira o nome.");
      return;
    }

    if (!Login) {
      toast.error("Por favor, insira o login.");
      return;
    }

    if (!NomeEmpresa) {
      toast.error("Por favor, insira o nome da empresa.");
      return;
    }

    if (!Tipo) {
      toast.error("Por favor, selecione o tipo.");
      return;
    }

    if (!Senha) {
      toast.error("Por favor, insira a senha.");
      return;
    }

    if (!fileDownloadURL) {
      toast.error("Por favor, insira um logo.");
      return;
    }

    // Preparing the user data for submission
    const foam = {
      Nome,
      Login,
      NomeEmpresa,
      Tipo,
      Senha,
      fileDownloadURL,
      adminPai: Tipo === "vendedor" ? selectedAdminId : null,
    };

    try {
      // Call function to add user to the login collection
      await addUserToLogin(foam, userId);
      toast.success("Usuário Cadastrado!");
    } catch (e) {
      toast.error("Erro ao cadastrar usuário.");
      console.error(e);
    }

    // Redirect after successful registration
    setTimeout(() => {
      router.push("/Users");
    }, 500);
  };

  const handleOpenMenuDiv = () => {
    setTimeout(() => {
      setOpenMenu(false);
    }, 100);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);

    if (file) {
      setIsFileSelected(true);
      try {
        const downloadURL = await uploadToFirebase(file);
        setFileDownloadURL(downloadURL);
        console.log(fileDownloadURL);
        toast.success("Arquivo enviado com sucesso!");
      } catch (error) {
        toast.error("Erro ao enviar o arquivo.");
      }
    }
  };

  const handleClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleClearFile = async () => {
    if (selectedFile) {
      // Obtendo referência para o arquivo
      const storageRef = ref(storage, `logos/${selectedFile.name}`);

      try {
        // Excluindo o arquivo da Storage
        await deleteObject(storageRef);
        toast.success("Arquivo excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir o arquivo.");
        console.error("Erro ao excluir o arquivo:", error);
      }
    }

    setSelectedFile(null);
    setFileDownloadURL(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    setIsFileSelected(false);
  };

  // SELECT ADMIN

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(
        query(collection(db, "Login"), where("Tipo", "==", "admin"))
      );
      const adminUsers: AdminUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<AdminUser, "id">;
        adminUsers.push({ ...data, id: doc.id });
      });

      setAdmins(adminUsers);
    };

    fetchAdmins();
  }, []);

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
            <p className={styles.BudgetTitle}>Usuário</p>
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
                <span className={styles.buttonText}>Cadastrar usuário</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as credencias do novo Usuário
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome completo</p>
                  <input
                    id="margemLucro"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome da empresa</p>
                  <input
                    id="margemLucro"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={(e) => setNomeEmpresa(e.target.value)}
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
                    onChange={(e) => setLogin(e.target.value)}
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Tipo de usuário</p>
                  <select
                    id="valorPerda"
                    className={styles.SelectField}
                    onChange={(e) => setTipo(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione o tipo de usuário
                    </option>
                    {userId === "lB2pGqkarGyq98VhMGM6" && (
                      <option value="admin">admin</option>
                    )}
                    <option value="vendedor">vendedor</option>
                  </select>
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Senha</p>
                  <input
                    id="valorMetro"
                    type="text"
                    className={styles.Field}
                    placeholder=""
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>

                {Tipo === "vendedor" && (
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Admin pai</p>
                    <select
                      id="adminPai"
                      className={styles.SelectField}
                      onChange={(e) => {
                        console.log(e.target.value); // Para validar a seleção no console
                        setSelectedAdminId(e.target.value);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecione o admin pai
                      </option>
                      {admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.Nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.userImage}>
              <p className={styles.logoTitle}>Logo da empresa</p>
              <img
                className={styles.logoDef}
                src={fileDownloadURL ? fileDownloadURL : "/logoDef.png"}
                alt="Logo da Empresa"
              />

              <p className={styles.Preview}>Envio da logo da empresa</p>

              <div
                className={styles.PrintContainer}
                style={{ display: !isFileSelected ? "flex" : "none" }}
              >
                <img src="/upload.png" className={styles.Upload} />

                <label htmlFor="fileInput" className={styles.LabelUpload}>
                  Arraste e jogue seu anexo aqui ou se preferir{" "}
                </label>
                <input
                  type="file"
                  accept=".svg, .webp, .jpeg, .jpg, .png"
                  onChange={handleFileChange}
                  id="fileInput"
                  style={{ display: "none" }}
                />
                <button className={styles.UploadButton} onClick={handleClick}>
                  Escolher arquivo
                </button>

                <p className={styles.UploadInfo}>
                  Formatos aceitos WEBP, SVG, JPEG e PNG
                </p>
              </div>

              <div
                className={styles.FileSelected}
                style={{ display: isFileSelected ? "flex" : "none" }}
              >
                <img src="./file.png" className={styles.FileImg} />

                <div className={styles.FileSelectedStats}>
                  <div className={styles.FileSelectedName}>
                    {selectedFile && (
                      <p className={styles.FileInfo}>{selectedFile.name}</p>
                    )}
                    <p className={styles.FileInfo}>100%</p>
                  </div>

                  <div className={styles.FileSelectedBar}></div>
                </div>

                <img
                  src="./trash.png"
                  className={styles.FileDelete}
                  onClick={handleClearFile}
                />
              </div>
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
