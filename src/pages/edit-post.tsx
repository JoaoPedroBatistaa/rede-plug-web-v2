import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewPost";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoadingOverlay from "@/components/Loading";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

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
      tankNumber: "",
      capacity: "",
      product: "",
      saleDefense: "",
      tankOption: "",
    },
  ]);
  const [nozzles, setNozzles] = useState([{ nozzleNumber: "", product: "" }]);
  const [managers, setManagers] = useState([
    { managerName: "", contact: "", password: "" },
  ]);

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

  const updateSupervisorToRemovePost = async (
    supervisorId: string,
    postName: any
  ) => {
    const supervisorRef = doc(db, "USERS", supervisorId);

    await updateDoc(supervisorRef, {
      posts: arrayRemove(postName),
    });
  };

  const removeSupervisor = async (indexToRemove: number) => {
    const supervisorIdToRemove =
      selectedSupervisors[indexToRemove]?.selectedSupervisorId;

    if (supervisorIdToRemove) {
      try {
        await updateSupervisorToRemovePost(supervisorIdToRemove, name);

        setSelectedSupervisors(
          selectedSupervisors.filter((_, index) => index !== indexToRemove)
        );

        toast.success("Supervisor removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover o nome do posto do supervisor:", error);
        toast.error("Erro ao remover o supervisor. Tente novamente.");
      }
    } else {
      console.error(
        "Supervisor ID não encontrado para o índice fornecido:",
        indexToRemove
      );
      toast.error("ID do Supervisor não encontrado.");
    }
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

  useEffect(() => {
    const fetchData = async () => {
      const docId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : router.query.id;

      console.log("Fetching data for docId:", docId); // Log para depuração

      if (docId) {
        const docRef = doc(db, "POSTS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data()); // Log para depuração
          const postData = docSnap.data();
          setName(postData.name);
          setOwner(postData.owner);
          setContact(postData.contact);
          setLocation(postData.location);
          setEmail(postData.email);
          setTanks(postData.tanks || []);
          setNozzles(postData.nozzles || []);
          setManagers(postData.managers || []);

          if (postData.supervisors) {
            console.log("Supervisors data:", postData.supervisors); // Log para depuração
          }

          const loadedSupervisors = postData.supervisors?.map(
            (supervisor: { id: any }) => ({
              selectedSupervisorId: supervisor.id,
            })
          ) || [{ selectedSupervisorId: "" }];

          setSelectedSupervisors(loadedSupervisors);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchData();
  }, [router.query.id]);

  const addTank = () => {
    setTanks([
      ...tanks,
      {
        tankNumber: "",
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
    setNozzles([...nozzles, { nozzleNumber: "", product: "" }]);
  };

  const removeNozzle = (indexToRemove: number) => {
    setNozzles(nozzles.filter((_, index) => index !== indexToRemove));
  };

  const addManager = () => {
    setManagers([...managers, { managerName: "", contact: "", password: "" }]);
  };

  const removeManager = async (indexToRemove: number) => {
    const isConfirmed = confirm("Deseja realmente excluir este gerente?");

    if (isConfirmed) {
      const managerToRemove = managers[indexToRemove];

      if (managerToRemove && managerToRemove.password) {
        try {
          await deleteDoc(doc(db, "USERS", managerToRemove.password));

          setManagers(managers.filter((_, index) => index !== indexToRemove));

          toast.success("Gerente excluído com sucesso!");
        } catch (error) {
          console.error("Erro ao excluir gerente:", error);
          toast.error("Erro ao excluir gerente.");
        }
      } else {
        console.error(
          "Gerente não encontrado ou sem identificador válido para exclusão."
        );
        toast.error("Erro ao excluir gerente: Identificador inválido.");
      }
    } else {
      console.log("Exclusão cancelada pelo usuário.");
    }
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

  const handleManagerChange = (index: number, field: any, value: any) => {
    const newManagers = managers.map((manager, i) => {
      if (i === index) {
        return { ...manager, [field]: value };
      }
      return manager;
    });
    setManagers(newManagers);
  };

  const addOrUpdateManagerToUsers = async (manager: {
    managerName: string;
    contact: string;
    password: string;
  }) => {
    try {
      let docRef;

      if (manager.password) {
        docRef = doc(db, "USERS", manager.password);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            email,
            postName: name,
            name: manager.managerName,
            contact: manager.contact,
          });
        } else {
          console.error("Gerente não encontrado para atualização.");
          toast.error("Gerente não encontrado.");
          return null;
        }
      } else {
        docRef = await addDoc(collection(db, "USERS"), {
          name: manager.managerName,
          email,
          password: "",
          postName: name,
          contact: manager.contact,
          type: "manager",
        });

        const password = docRef.id;
        await updateDoc(docRef, { password });

        return {
          managerName: manager.managerName,
          contact: manager.contact,
          password,
        };
      }

      return {
        managerName: manager.managerName,
        contact: manager.contact,
        password: docRef.id,
      };
    } catch (error) {
      console.error("Erro ao adicionar/atualizar gerente em USERS:", error);
      toast.error("Erro ao adicionar/atualizar gerente.");
      throw new Error("Erro ao adicionar/atualizar gerente.");
    }
  };

  const validateForm = () => {
    const fields = [
      name,
      owner,
      contact,
      location,
      email,
      ...tanks,
      ...nozzles,
      ...managers,
    ];

    return fields.every((field) => {
      if (typeof field === "object") {
        return Object.entries(field).every(([key, value]) => {
          if (key === "password") return true;
          return value.trim() !== "";
        });
      }
      return field.trim() !== "";
    });
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    const docId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;

    if (!docId) {
      toast.error("ID do documento não fornecido.");
      return;
    }

    try {
      const updatedManagersWithPasswords = [];
      for (const manager of managers) {
        const updatedManager = await addOrUpdateManagerToUsers(manager);
        updatedManagersWithPasswords.push(updatedManager);
      }

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

      const updateData = {
        name,
        owner,
        contact,
        location,
        email,
        tanks,
        nozzles,
        managers: updatedManagersWithPasswords,
        supervisors: supervisorsList,
      };

      const postRef = doc(db, "POSTS", docId);
      await updateDoc(postRef, updateData);

      console.log("Post atualizado com sucesso. ID:", docId);
      toast.success("Posto e gerentes atualizados com sucesso!");

      router.push("/posts");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao completar a atualização.");
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
            <p className={styles.BudgetTitle}>Editar posto</p>
            <div className={styles.BudgetHeadS}>
              <button className={styles.FinishButton} onClick={handleSubmit}>
                <img
                  src="./finishBudget.png"
                  alt="Finalizar"
                  className={styles.buttonImage}
                />
                <span className={styles.buttonText}>Atualizar posto</span>
              </button>
            </div>
          </div>

          <p className={styles.Notes}>Edite abaixo as informações do posto</p>

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

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Proprietário</p>
                  <input
                    id="owner"
                    type="text"
                    className={styles.Field}
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    placeholder=""
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Contato</p>
                  <input
                    id="contact"
                    type="text"
                    className={styles.Field}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
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

                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Senha</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={manager.password}
                      disabled
                      onChange={(e) =>
                        handleManagerChange(index, "password", e.target.value)
                      }
                      placeholder=""
                    />
                  </div>

                  <button onClick={addManager} className={styles.NewButton}>
                    <span className={styles.buttonText}>Novo gerente</span>
                  </button>

                  <button
                    onClick={() => removeManager(index)}
                    className={styles.DeleteButton}
                  >
                    <span className={styles.buttonText}>Excluir gerente</span>
                  </button>
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
                      className={styles.SelectField} // Confirme se esta classe existe
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

                  {index >= 0 && (
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