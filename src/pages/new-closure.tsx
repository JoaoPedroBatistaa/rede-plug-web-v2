import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, getDownloadURL, ref, storage } from "../../firebase";

import LoadingOverlay from "@/components/Loading";
import { uploadBytes } from "firebase/storage";

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [managerName, setManagerName] = useState("");

  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [liters, setLiters] = useState("");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("");
  const [post, setPost] = useState("");
  const [observations, setObservations] = useState("");
  const [detailObservations, setDetailObservations] = useState("");

  const etanolRef = useRef(null);

  const [etanolImage, setEtanolImage] = useState<File | null>(null);
  const [etanolFileName, setEtanolFileName] = useState("");

  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectedPostsIndices, setSelectedPostsIndices] = useState([0]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "POSTS");
      const q = query(postsRef, where("name", "!=", ""));
      const querySnapshot = await getDocs(q);
      const postData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // @ts-ignore
      setPosts(postData);
    };
    fetchPosts();
  }, []);

  const handleSelectChange = (
    index: number,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    if (value && value !== "placeholder") {
      const newSelectedPosts = [...selectedPosts];
      // @ts-ignore
      const selectedPost = posts.find((post) => post.id === value);

      if (selectedPost) {
        // @ts-ignore
        newSelectedPosts[index] = selectedPost.name;
      } else {
        console.error("Posto não encontrado!");
      }

      setSelectedPosts(newSelectedPosts);
    }
  };

  const addNewPost = () => {
    setSelectedPostsIndices((prevIndices) => [
      ...prevIndices,
      prevIndices.length,
    ]);
  };

  const removePost = (index: number) => {
    setSelectedPostsIndices((prevIndices) =>
      prevIndices.filter((i) => i !== index)
    );
  };

  const handleEtanolImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    if (file) {
      setEtanolImage(file);
      setEtanolFileName(file.name);
    }
  };

  const getLocalISODate = () => {
    const date = new Date();
    // Ajustar para o fuso horário -03:00
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 10);
  };

  const saveMeasurement = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = getLocalISODate();
    console.log(today);

    if (!date) missingField = "Data";
    // else if (date !== today) {
    //   toast.error("Você deve cadastrar a data correta de hoje!");
    //   setIsLoading(false);
    //   return;
    // } else if (!time) missingField = "Hora";
    // else if (!managerName) missingField = "Nome do supervisor";
    else if (!etanolImage) missingField = "Fotos da tarefa";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");
    // const postName = localStorage.getItem("userPost");

    // const managersRef = collection(db, "CLOSURES");
    // const q = query(
    //   managersRef,
    //   where("date", "==", date),
    //   where("id", "==", "iluminacao-pista"),
    //   where("userName", "==", userName),
    //   where("postName", "==", postName)
    // );

    // const querySnapshot = await getDocs(q);
    // if (!querySnapshot.empty) {
    //   toast.error("A tarefa iluminação da pista já foi feita hoje!");
    //   setIsLoading(false);

    //   return;
    // }

    const taskData = {
      date,
      time,
      userName,
      makerName: managerName,
      posts: selectedPosts,
      value,
      type,
      observations,
      detailObservations,
      price,
      liters,
      payment,

      images: [],
      id: "closure",
    };

    const uploadPromises = [];
    if (etanolImage) {
      const etanolPromise = uploadImageAndGetUrl(
        etanolImage,
        `closures/${date}/${etanolFileName}_${Date.now()}`
      ).then((imageUrl) => ({
        type: "Imagem da tarefa",
        imageUrl,
        fileName: etanolFileName,
      }));
      uploadPromises.push(etanolPromise);
    }

    try {
      const images = await Promise.all(uploadPromises);
      // @ts-ignore
      taskData.images = images;

      const docRef = await addDoc(collection(db, "CLOSURES"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);
      toast.success("Fechamento salvo com sucesso!");
      // @ts-ignore
      router.push(`/closures`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
    }
  };

  async function uploadImageAndGetUrl(imageFile: File, path: string) {
    const storageRef = ref(storage, path);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    return downloadUrl;
  }

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
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Novo fechamento</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={saveMeasurement}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar fechamento</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações do fechamento
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Data</p>
                  <input
                    id="date"
                    type="date"
                    className={styles.Field}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Hora</p>
                  <input
                    id="time"
                    type="time"
                    className={styles.Field}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do operador</p>
                  <input
                    id="time"
                    type="text"
                    className={styles.Field}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Posto</p>
              <p className={styles.Notes}>
                Selecione abaixo o(s) postos referentes ao fechamento
              </p>

              {selectedPostsIndices.map((index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Posto</p>
                    <select
                      className={styles.SelectField}
                      onChange={(e) => handleSelectChange(index, e)}
                    >
                      <option value="" defaultChecked>
                        Selecione o posto
                      </option>
                      {posts.map((post) => (
                        // @ts-ignore
                        <option key={post.id} value={post.id}>
                          {
                            // @ts-ignore
                            post.name
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedPostsIndices.length > 1 && (
                    <button
                      onClick={() => removePost(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir posto</span>
                    </button>
                  )}
                  <button onClick={addNewPost} className={styles.NewButton}>
                    <span className={styles.buttonText}>Novo posto</span>
                  </button>
                </div>
              ))}

              <p className={styles.BudgetTitle}>Despesa</p>
              <p className={styles.Notes}>
                Informe abaixo os valores da despesa
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Valor da despesa</p>
                  <input
                    id="driverName"
                    type="text"
                    className={styles.Field}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Classificação da despesa</p>
                  <select
                    id="driverName"
                    className={styles.SelectField}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Compra de combustíveis">
                      Compra de combustíveis
                    </option>
                    <option value="Prestação de serviços">
                      Prestação de serviços
                    </option>
                    <option value="Manutenção posto">Manutenção posto</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Salários">Salários</option>
                    <option value="Materiais diversos">
                      Materiais diversos
                    </option>
                    <option value="Despesas Operacionais">
                      Despesas Operacionais
                    </option>
                    <option value="Internet/Água/Energia">
                      Internet/Água/Energia
                    </option>
                    <option value="Parcela Postos">Parcela Postos</option>
                    <option value="Venda de Filtros">Venda de Filtros</option>
                    <option value="Dividendos">Dividendos</option>
                    <option value="Receita de Aluguéis">
                      Receita de Aluguéis
                    </option>
                    <option value="Benefícios">Benefícios</option>
                  </select>
                </div>

                {type === "Compra de combustíveis" ? (
                  <>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Litros</p>
                      <input
                        id="driverName"
                        type="text"
                        className={styles.Field}
                        value={liters}
                        onChange={(e) => setLiters(e.target.value)}
                        placeholder=""
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Preço</p>
                      <input
                        id="driverName"
                        type="text"
                        className={styles.Field}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder=""
                      />
                    </div>
                  </>
                ) : null}
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>
                    Descrição detalhada da despesa
                  </p>
                  <textarea
                    id="observations"
                    className={styles.Field}
                    value={detailObservations}
                    onChange={(e) => setDetailObservations(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Pagamento</p>
              <p className={styles.Notes}>
                Informe abaixo os valores do pagamento
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Forma de pagamento</p>
                  <select
                    id="driverName"
                    className={styles.SelectField}
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="Pix">Pix</option>
                    <option value="Ted">Ted</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                  </select>
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Imagem do comprovante</p>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={etanolRef}
                    onChange={handleEtanolImageChange}
                  />
                  <button
                    onClick={() =>
                      // @ts-ignore
                      etanolRef.current && etanolRef.current.click()
                    }
                    className={styles.MidiaField}
                  >
                    Carregue sua foto
                  </button>
                  {etanolImage && (
                    <div>
                      <img
                        src={URL.createObjectURL(etanolImage)}
                        alt="Preview do teste de Etanol"
                        style={{
                          maxWidth: "17.5rem",
                          height: "auto",
                          border: "1px solid #939393",
                          borderRadius: "20px",
                        }}
                        // @ts-ignore
                        onLoad={() => URL.revokeObjectURL(etanolImage)}
                      />
                      <p className={styles.fileName}>{etanolFileName}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Observações</p>
                  <textarea
                    id="observations"
                    className={styles.Field}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
