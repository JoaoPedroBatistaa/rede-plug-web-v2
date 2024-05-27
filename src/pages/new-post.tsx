import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewPost";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

import LoadingOverlay from "@/components/Loading";

interface Supervisor {
  id: string;
  name: string;

  contact: string;
  email: string;
  password: string;
}

export default function NewPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      router.push("/");
    }
  }, []);

  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [tanks, setTanks] = useState([
    {
      tankNumber: 1,
      capacity: "",
      product: "",
      saleDefense: "",
      tankOption: "",
    },
  ]);
  const [nozzles, setNozzles] = useState([{ nozzleNumber: 1, product: "" }]);
  const [bombs, setBombs] = useState([{ bombNumber: 1, model: "" }]);
  const [managers, setManagers] = useState([{ managerName: "", contact: "" }]);
  const [tankOptions, setTankOptions] = useState([]);

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([
    { selectedSupervisorId: "" },
  ]);

  const addSupervisor = () => {
    setSelectedSupervisors([
      ...selectedSupervisors,
      { selectedSupervisorId: "" },
    ]);
  };

  const removeSupervisor = (indexToRemove: number) => {
    setSelectedSupervisors(
      selectedSupervisors.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSupervisorChange = (index: number, supervisorId: string) => {
    const newSelectedSupervisors = selectedSupervisors.map((item, i) => {
      if (i === index) {
        return { ...item, selectedSupervisorId: supervisorId };
      }
      return item;
    });
    setSelectedSupervisors(newSelectedSupervisors);
  };

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const path = "USERS";

      const dbQuery = query(
        collection(db, path),
        where("type", "==", "supervisor")
      );
      const querySnapshot = await getDocs(dbQuery);
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        contact: doc.data().contact,
        password: doc.data().password,
      }));

      if (isComponentMounted) {
        setSupervisors(postsList);
        console.log("Set data: ", postsList);
      }
    };
    fetchData();

    return () => {
      isComponentMounted = false;
    };
  }, []);

  useEffect(() => {
    const loadConversionData = async () => {
      const filePath = `/data/conversion.json`;
      const response = await fetch(filePath);
      if (!response.ok) {
        console.error(
          "Falha ao carregar o arquivo de conversão",
          response.statusText
        );
        return;
      }
      const conversionData = await response.json();

      const tankSet = new Set(
        conversionData.map((item: { Tanque: any }) => item.Tanque)
      );
      // @ts-ignore
      const uniqueTanks = Array.from(tankSet).sort((a, b) => a - b);

      // @ts-ignore
      setTankOptions(uniqueTanks);
    };

    loadConversionData();
  }, []);

  const addTank = () => {
    const newTankNumber = tanks.length + 1;
    setTanks([
      ...tanks,
      {
        tankNumber: newTankNumber,
        capacity: "",
        product: "",
        saleDefense: "",
        tankOption: "",
      },
    ]);
  };

  const removeTank = (indexToRemove: number) => {
    setTanks(tanks.filter((_, index) => index !== indexToRemove));
  };

  const addNozzle = () => {
    const newNozzleNumber = nozzles.length + 1;
    setNozzles([...nozzles, { nozzleNumber: newNozzleNumber, product: "" }]);
  };

  const removeNozzle = (indexToRemove: number) => {
    setNozzles(nozzles.filter((_, index) => index !== indexToRemove));
  };

  const addBomb = () => {
    const newBombNumber = bombs.length + 1;
    setBombs([...bombs, { bombNumber: newBombNumber, model: "" }]);
  };

  const removeBomb = (indexToRemove: number) => {
    const updatedBombs = bombs
      .filter((_, index) => index !== indexToRemove)
      .map((bomb, index) => ({ ...bomb, bombNumber: index + 1 }));
    setBombs(updatedBombs);
  };

  const addManager = () => {
    setManagers([...managers, { managerName: "", contact: "" }]);
  };

  const removeManager = (indexToRemove: number) => {
    setManagers(managers.filter((_, index) => index !== indexToRemove));
  };

  const handleTankChange = (index: number, field: any, value: any) => {
    const newTanks = tanks.map((tank, i) => {
      if (i === index) {
        return { ...tank, [field]: value };
      }
      return tank;
    });
    setTanks(newTanks);
  };

  const handleNozzleChange = (index: number, field: any, value: any) => {
    const newNozzles = nozzles.map((nozzle, i) => {
      if (i === index) {
        return { ...nozzle, [field]: value };
      }
      return nozzle;
    });
    setNozzles(newNozzles);
  };

  const handleBombChange = (index: number, field: any, value: any) => {
    const newBombs = bombs.map((bomb, i) => {
      if (i === index) {
        return { ...bomb, [field]: value };
      }
      return bomb;
    });
    setBombs(newBombs);
  };

  const handleManagerChange = (index: number, field: any, value: any) => {
    const newManagers = managers.map((manager, i) => {
      if (i === index) {
        return { ...manager, [field]: value };
      }
      return manager;
    });
    setManagers(newManagers);
  };

  const addManagerToUsers = async (manager: {
    managerName: string;
    contact: string;
  }) => {
    try {
      const docRef = await addDoc(collection(db, "USERS"), {
        name: manager.managerName,
        email,
        password: "",
        postName: name,
        contact: manager.contact,
        type: "manager",
      });

      const password = docRef.id;
      await updateDoc(doc(db, "USERS", password), { password });

      return {
        managerName: manager.managerName,
        contact: manager.contact,
        password,
      };
    } catch (error) {
      console.error("Erro ao adicionar gerente a USERS:", error);
      toast.error("Erro ao adicionar gerente.");
      throw new Error("Erro ao adicionar gerente.");
    }
  };

  const updateSupervisorPosts = async (
    supervisorId: string,
    postName: unknown
  ) => {
    const supervisorRef = doc(db, "USERS", supervisorId);
    await updateDoc(supervisorRef, {
      posts: arrayUnion(postName),
    });
  };

  const validateForm = () => {
    const fields = [
      name,
      location,
      email,
      ...tanks,
      ...nozzles,
      ...bombs,
      ...managers,
    ];

    return fields.every((field) => {
      if (typeof field === "object") {
        return Object.values(field).every((value) => {
          if (typeof value === "string") {
            return value.trim() !== "";
          }
          if (typeof value === "number") {
            return !isNaN(value);
          }
          return value != null;
        });
      }
      if (typeof field === "string") {
        return field.trim() !== "";
      }
      if (typeof field === "number") {
        return !isNaN(field);
      }
      return field != null;
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      const supervisorsList = selectedSupervisors.map((supervisor) => {
        const supervisorData = supervisors.find(
          (sup) => sup.id === supervisor.selectedSupervisorId
        );
        return {
          id: supervisor.selectedSupervisorId,
          name: supervisorData?.name || "",
        };
      });

      for (const supervisor of supervisorsList) {
        await updateSupervisorPosts(supervisor.id, name);
      }

      const updatedManagers = [];
      for (const manager of managers) {
        const managerWithSenha = await addManagerToUsers(manager);
        updatedManagers.push(managerWithSenha);
      }

      const postRef = await addDoc(collection(db, "POSTS"), {
        name,
        location,
        email,
        tanks,
        nozzles,
        bombs,
        managers: updatedManagers,
        supervisors: supervisorsList,
      });

      console.log("Post adicionado com ID:", postRef.id);
      toast.success("Posto supervisores e gerentes adicionados com sucesso!");

      const userRef = await addDoc(collection(db, "USERS"), {
        email: email,
        name: name,
        type: "post",
        password: postRef.id,
      });

      console.log("Usuário adicionado com ID:", userRef.id);

      router.push("/posts");
    } catch (error) {
      console.error("Erro ao adicionar dados:", error);
      toast.error("Erro ao completar o registro.");
    } finally {
      setIsLoading(false);
    }
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
      <LoadingOverlay isLoading={isLoading} />

      <div className={styles.Container}>
        <div className={styles.BudgetContainer}>
          <div className={styles.BudgetHead}>
            <p className={styles.BudgetTitle}>Novo posto</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={handleSubmit}>
                <img
                  src="/finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Cadastrar posto</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações do novo posto
          </p>

          <div className={styles.userContent}>
            <div className={styles.userData}>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do posto</p>
                  <input
                    id="name"
                    type="text"
                    className={styles.Field}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Localização</p>
                  <input
                    id="location"
                    type="text"
                    className={styles.Field}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Email</p>
                  <input
                    id="email"
                    type="text"
                    className={styles.Field}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <div className={styles.BudgetHead}>
                <p className={styles.BudgetTitle}>Tanques</p>
                <div className={styles.BudgetHeadS}></div>
              </div>

              <p className={styles.Notes}>
                Informe abaixo as informações dos tanques
              </p>

              {tanks.map((tank, index) => (
                <>
                  <div key={index} className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Número do tanque</p>
                      <input
                        type="number"
                        className={styles.Field}
                        value={tank.tankNumber}
                        onChange={(e) =>
                          handleTankChange(index, "tankNumber", e.target.value)
                        }
                        disabled
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Capacidade</p>
                      <input
                        type="text"
                        className={styles.Field}
                        value={tank.capacity}
                        onChange={(e) =>
                          handleTankChange(index, "capacity", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Produto</p>
                      <select
                        className={styles.SelectField}
                        value={tank.product}
                        onChange={(e) =>
                          handleTankChange(index, "product", e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Selecione...
                        </option>
                        <option value="GC">GC</option>
                        <option value="GA">GA</option>
                        <option value="ET">ET</option>
                        <option value="EA">EA</option>
                        <option value="SECO">SECO</option>
                        <option value="S10">S10</option>
                      </select>
                    </div>

                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Venda/Defesa</p>
                      <select
                        className={styles.SelectField}
                        value={tank.saleDefense}
                        onChange={(e) =>
                          handleTankChange(index, "saleDefense", e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Selecione
                        </option>
                        <option value="Venda">Venda</option>
                        <option value="Defesa">Defesa</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.InputContainer}>
                    <div className={styles.InputField}>
                      <p className={styles.FieldLabel}>Opção de Tanque</p>
                      <select
                        className={styles.SelectField}
                        value={tank.tankOption}
                        onChange={(e) =>
                          handleTankChange(index, "tankOption", e.target.value)
                        }
                      >
                        <option value="">Selecione um tanque</option>
                        {tankOptions.map((option) => (
                          <option key={option} value={option}>
                            Tanque {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button onClick={addTank} className={styles.NewButton}>
                      <span className={styles.buttonText}>Novo tanque</span>
                    </button>

                    {index > 0 && (
                      <button
                        onClick={() => removeTank(index)}
                        className={styles.DeleteButton}
                      >
                        <span className={styles.buttonText}>
                          Excluir tanque
                        </span>
                      </button>
                    )}
                  </div>
                </>
              ))}

              <div className={styles.BudgetHead}>
                <p className={styles.BudgetTitle}>Bombas</p>
                <div className={styles.BudgetHeadS}></div>
              </div>

              <p className={styles.Notes}>
                Informe abaixo as informações das bombas
              </p>

              {bombs.map((bomb, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Número da bomba</p>
                    <input
                      type="number"
                      className={styles.Field}
                      value={bomb.bombNumber}
                      onChange={(e) =>
                        handleBombChange(index, "bombNumber", e.target.value)
                      }
                      disabled
                    />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Modelo</p>
                    <select
                      className={styles.SelectField}
                      value={bomb.model}
                      onChange={(e) =>
                        handleBombChange(index, "model", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      <option value="Dupla">Dupla</option>
                      <option value="Quadrupla">Quadrupla</option>
                      <option value="Sextupla">Sextupla</option>
                      <option value="Octupla">Octupla</option>
                    </select>
                  </div>

                  <button onClick={addBomb} className={styles.NewButton}>
                    <span className={styles.buttonText}>Nova bomba</span>
                  </button>

                  {index > 0 && (
                    <button
                      onClick={() => removeBomb(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir bomba</span>
                    </button>
                  )}
                </div>
              ))}

              <div className={styles.BudgetHead}>
                <p className={styles.BudgetTitle}>Bicos</p>
                <div className={styles.BudgetHeadS}></div>
              </div>

              <p className={styles.Notes}>
                Informe abaixo as informações dos bicos
              </p>

              {nozzles.map((nozzle, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Número do Bico</p>
                    <input
                      type="number"
                      className={styles.Field}
                      value={nozzle.nozzleNumber}
                      onChange={(e) =>
                        handleNozzleChange(
                          index,
                          "nozzleNumber",
                          e.target.value
                        )
                      }
                      disabled
                    />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Produto</p>
                    <select
                      className={styles.SelectField}
                      value={nozzle.product}
                      onChange={(e) =>
                        handleNozzleChange(index, "product", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      <option value="GC">GC</option>
                      <option value="GA">GA</option>
                      <option value="ET">ET</option>
                      <option value="EA">EA</option>
                      <option value="SECO">SECO</option>
                      <option value="S10">S10</option>
                    </select>
                  </div>

                  <button onClick={addNozzle} className={styles.NewButton}>
                    <span className={styles.buttonText}>Novo bico</span>
                  </button>

                  {index > 0 && (
                    <button
                      onClick={() => removeNozzle(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir bico</span>
                    </button>
                  )}
                </div>
              ))}

              <div className={styles.BudgetHead}>
                <p className={styles.BudgetTitle}>Gerentes</p>
                <div className={styles.BudgetHeadS}></div>
              </div>

              <p className={styles.Notes}>
                Informe abaixo as informações dos gerentes
              </p>

              {managers.map((manager, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Nome do Gerente</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={manager.managerName}
                      onChange={(e) =>
                        handleManagerChange(
                          index,
                          "managerName",
                          e.target.value
                        )
                      }
                      placeholder=""
                    />
                  </div>

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Contato</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={manager.contact}
                      onChange={(e) =>
                        handleManagerChange(index, "contact", e.target.value)
                      }
                      placeholder=""
                    />
                  </div>

                  <button onClick={addManager} className={styles.NewButton}>
                    <span className={styles.buttonText}>Novo gerente</span>
                  </button>

                  {index > 0 && (
                    <button
                      onClick={() => removeManager(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir gerente</span>
                    </button>
                  )}
                </div>
              ))}

              <div className={styles.BudgetHead}>
                <p className={styles.BudgetTitle}>Supervisores</p>
                <div className={styles.BudgetHeadS}></div>
              </div>

              <p className={styles.Notes}>
                Informe abaixo as informações dos supervisores
              </p>

              {selectedSupervisors.map((supervisor, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Nome do Supervisor</p>
                    <select
                      className={styles.SelectField}
                      value={supervisor.selectedSupervisorId || ""}
                      onChange={(e) =>
                        handleSupervisorChange(index, e.target.value)
                      }
                    >
                      <option value="">Selecione um supervisor</option>
                      {supervisors.map((sup) => (
                        <option key={sup.id} value={sup.id}>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {index === selectedSupervisors.length - 1 && (
                    <button
                      onClick={addSupervisor}
                      className={styles.NewButton}
                    >
                      <span className={styles.buttonText}>Novo supervisor</span>
                    </button>
                  )}

                  {index > 0 && (
                    <button
                      onClick={() => removeSupervisor(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>
                        Excluir supervisor
                      </span>
                    </button>
                  )}
                </div>
              ))}
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
