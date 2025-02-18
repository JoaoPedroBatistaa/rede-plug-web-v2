import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewPost";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import dynamic from "next/dynamic";
import { db } from "../../firebase";
const LoadingOverlay = dynamic(() => import("@/components/Loading"), {
  ssr: false,
});

interface Supervisor {
  id: string;
  name: string;

  contact: string;
  email: string;
  password: string;
}

export default function EditPost() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  // //   const checkLoginDuration = () => {
  // //     console.log("Checking login duration...");
  // //     const storedDate = localStorage.getItem("loginDate");
  // //     const storedTime = localStorage.getItem("loginTime");

  // //     if (storedDate && storedTime) {
  // //       const storedDateTime = new Date(`${storedDate}T${storedTime}`);
  // //       console.log("Stored login date and time:", storedDateTime);

  // //       const now = new Date();
  // //       const maxLoginDuration = 6 * 60 * 60 * 1000;

  // //       if (now.getTime() - storedDateTime.getTime() > maxLoginDuration) {
  // //         console.log("Login duration exceeded 60 seconds. Logging out...");

  // //         localStorage.removeItem("userId");
  // //         localStorage.removeItem("userName");
  // //         localStorage.removeItem("userType");
  // //         localStorage.removeItem("userPost");
  // //         localStorage.removeItem("posts");
  // //         localStorage.removeItem("loginDate");
  // //         localStorage.removeItem("loginTime");

  // //         alert("Sua sessão expirou. Por favor, faça login novamente.");
  // //         window.location.href = "/";
  // //       } else {
  // //         console.log("Login duration within limits.");
  // //       }
  // //     } else {
  // //       console.log("No stored login date and time found.");
  // //     }
  // //   };

  // //   checkLoginDuration();
  // // }, []);

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
  const [password, setPassword] = useState("");
  const [tanks, setTanks] = useState([
    {
      tankNumber: "",
      capacity: "",
      product: "",
      saleDefense: "",
      tankOption: "",
    },
  ]);
  const [bombs, setBombs] = useState([{ bombNumber: 1, model: "" }]);

  const [nozzles, setNozzles] = useState([{ nozzleNumber: "", product: "" }]);
  const [managers, setManagers] = useState<
    {
      managerName: string;
      oldManagerName: string;
      contact: string;
      password: string;
    }[]
  >([]);

  const [tankOptions, setTankOptions] = useState([]);

  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: null, lng: null });
  const [radiusCoordinates, setRadiusCoordinates] = useState([]);

  const [mapUrl, setMapUrl] = useState("");

  const calculateCoordinatesInRadius = (
    center: { lat: number; lng: number },
    radius = 200,
    stepSize = 0.1
  ) => {
    const points = [];
    const earthRadius = 6371000; // Radius of the Earth in meters

    // Convert center coordinates to radians
    const lat1 = (center.lat * Math.PI) / 180;
    const lng1 = (center.lng * Math.PI) / 180;

    console.log("Starting calculation of coordinates within the radius.");

    for (let angle = 0; angle < 360; angle += stepSize) {
      const bearing = (angle * Math.PI) / 180; // Convert to radians

      for (let dist = 0; dist <= radius; dist += stepSize) {
        const lat2 = Math.asin(
          Math.sin(lat1) * Math.cos(dist / earthRadius) +
            Math.cos(lat1) * Math.sin(dist / earthRadius) * Math.cos(bearing)
        );
        const lng2 =
          lng1 +
          Math.atan2(
            Math.sin(bearing) * Math.sin(dist / earthRadius) * Math.cos(lat1),
            Math.cos(dist / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
          );

        points.push({
          lat: (lat2 * 180) / Math.PI, // Convert back to degrees
          lng: (lng2 * 180) / Math.PI, // Convert back to degrees
        });
      }
    }

    console.log("Finished calculation of coordinates.");

    // Log all points
    points.forEach((point, index) => {
      const coordUrl = `https://www.google.com/maps?q=${point.lat},${point.lng}&output=embed`;
      console.log(`Coordinate ${index + 1}: ${coordUrl}`);
    });

    return points;
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true);
      console.log(
        "Geolocation is available. Attempting to get current position."
      );
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoordinates({ lat, lng });

          const newUrl = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
          setMapUrl(newUrl);

          console.log(`Current position obtained: lat=${lat}, lng=${lng}`);

          const radiusCoords = calculateCoordinatesInRadius({ lat, lng });
          // @ts-ignore
          setRadiusCoordinates(radiusCoords);

          // Log URLs for checking
          // radiusCoords.forEach((coord, index) => {
          //   const coordUrl = `https://www.google.com/maps?q=${coord.lat},${coord.lng}&output=embed`;
          //   console.log(`Coordinate ${index + 1}: ${coordUrl}`);
          // });

          // Add a timeout before setting loading to false
          setTimeout(() => {
            setIsLoading(false);
            toast.success("Localização obtida com sucesso!");
          }, 2000);
        },
        (error) => {
          // Set loading to false immediately in case of an error
          setIsLoading(false);
          console.error("Error obtaining location:", error);
          setCoordinates({ lat: null, lng: null });

          if (error.code === error.PERMISSION_DENIED) {
            toast.error(
              "Permissão de localização negada. Por favor, habilite a permissão de localização nas configurações do seu navegador."
            );
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            toast.error(
              "A localização não está disponível. Por favor, verifique sua conexão com a internet ou tente novamente mais tarde."
            );
          } else if (error.code === error.TIMEOUT) {
            toast.error(
              "O tempo para obter a localização esgotou. Por favor, tente novamente."
            );
          } else {
            toast.error(
              "Erro ao obter a localização. Por favor, tente novamente."
            );
          }
        }
      );
    } else {
      console.log("Geolocation is not available in this browser.");
      toast.error("Geolocalização não está disponível neste navegador.");
    }
  };

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

      console.log("Fetching data for docId:", docId);

      if (docId) {
        const docRef = doc(db, "POSTS", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          const postData = docSnap.data();
          setName(postData.name);
          setOwner(postData.owner);
          setContact(postData.contact);
          setLocation(postData.location);
          setEmail(postData.email);
          setTanks(postData.tanks || []);
          setBombs(postData.bombs || []);
          setNozzles(postData.nozzles || []);

          // Adiciona oldManagerName no estado dos gerentes
          const managersWithOldName = (postData.managers || []).map(
            (manager: any) => ({
              ...manager,
              oldManagerName: manager.managerName, // Adiciona o nome antigo
            })
          );
          setManagers(managersWithOldName);

          // Busca a senha do frentista na coleção USERS
          const q = query(
            collection(db, "USERS"),
            where("type", "==", "post"),
            where("name", "==", postData.name)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setPassword(userData.password);
          } else {
            console.log("No post user found for the provided post name.");
          }

          if (
            postData.location &&
            postData.location.lat &&
            postData.location.lng
          ) {
            const newUrl = `https://www.google.com/maps?q=${postData.location.lat},${postData.location.lng}&output=embed`;
            setMapUrl(newUrl);
            setCoordinates({
              lat: postData.location.lat,
              lng: postData.location.lng,
            });
          }
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

  const addNozzle = () => {
    setNozzles([...nozzles, { nozzleNumber: "", product: "" }]);
  };

  const removeNozzle = (indexToRemove: number) => {
    setNozzles(nozzles.filter((_, index) => index !== indexToRemove));
  };

  const addManager = () => {
    // @ts-ignore
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

  const handleBombChange = (index: number, field: any, value: any) => {
    const newBombs = bombs.map((bomb, i) => {
      if (i === index) {
        return { ...bomb, [field]: value };
      }
      return bomb;
    });
    setBombs(newBombs);
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

  const handleManagerChange = (index: number, field: string, value: string) => {
    setManagers((prevManagers) =>
      prevManagers.map((manager, i) =>
        i === index ? { ...manager, [field]: value } : manager
      )
    );
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
    const fields = [name, location, email, ...tanks, ...nozzles, ...managers];

    return fields.every((field) => {
      if (typeof field === "object" && field !== null) {
        return Object.entries(field).every(([key, value]) => {
          if (key === "password") return true;
          return typeof value === "string" && value.trim() !== "";
        });
      }
      return typeof field === "string" && field.trim() !== "";
    });
  };

  const updateManagerFields = async (
    manager: {
      managerName: string;
      oldManagerName: string;
      contact: string;
      password: string;
    },
    postName: string
  ) => {
    try {
      const q = query(
        collection(db, "USERS"),
        where("type", "==", "manager"),
        where("name", "==", manager.oldManagerName), // Busca pelo nome antigo
        where("postName", "==", postName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          name: manager.managerName, // Atualiza para o novo nome
          contact: manager.contact,
          password: manager.password,
          email: email,
        });
      } else {
        throw new Error(
          `Nenhum gerente encontrado para o nome ${manager.oldManagerName} e posto ${postName}.`
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar campos do gerente:", error);
      toast.error("Erro ao atualizar campos do gerente.");
    }
  };

  const updateUserPassword = async (postName: string, newPassword: string) => {
    const q = query(
      collection(db, "USERS"),
      where("type", "==", "post"),
      where("name", "==", postName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { password: newPassword, email: email });
    } else {
      throw new Error("No post user found for the provided post name.");
    }
  };

  const updateManagerPassword = async (
    managerName: string,
    postName: string,
    newPassword: string
  ) => {
    const q = query(
      collection(db, "USERS"),
      where("type", "==", "manager"),
      where("name", "==", managerName),
      where("postName", "==", postName)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, { password: newPassword });
    } else {
      throw new Error(
        "No manager user found for the provided manager name and post name."
      );
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const docId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;

    if (!docId) {
      toast.error("ID do documento não fornecido.");
      setIsLoading(false);
      return;
    }

    try {
      // Atualiza a senha do frentista na coleção USERS
      if (password) {
        await updateUserPassword(name, password);
      }

      // Atualiza gerentes
      for (const manager of managers) {
        if (manager.password) {
          await updateManagerFields(manager, name); // Inclui oldManagerName
        } else {
          console.error(
            "Gerente não possui identificador válido (password):",
            manager
          );
        }
      }

      // Atualiza o posto
      const postRef = doc(db, "POSTS", docId);
      await updateDoc(postRef, {
        name,
        location: coordinates,
        email,
        password,
        tanks,
        nozzles,
        bombs,
        managers: managers.map(({ oldManagerName, ...rest }) => rest), // Remove oldManagerName
      });

      toast.success("Posto e gerentes atualizados com sucesso!");
      router.push("/posts");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao completar a atualização.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
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
                  src="/finishBudget.png"
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
              </div>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Localização</p>
                  <button
                    onClick={getLocation}
                    className={styles.locationButton}
                  >
                    Cadastrar localização
                  </button>
                  {coordinates.lat && coordinates.lng && (
                    <p className={styles.locText}>
                      Lat: {coordinates.lat}, Lng: {coordinates.lng}
                    </p>
                  )}

                  {coordinates.lat && coordinates.lng && (
                    <>
                      <div className={styles.InputContainer}>
                        <iframe
                          src={mapUrl}
                          width="320"
                          height="280"
                          loading="lazy"
                          style={{ border: 0 }}
                          allowFullScreen
                        ></iframe>
                      </div>
                    </>
                  )}
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Latitude</p>
                  <input
                    id="latitude"
                    type="number"
                    className={styles.Field}
                    value={coordinates.lat || ""}
                    onChange={(e) =>
                      setCoordinates((prev) => ({
                        ...prev,
                        lat: parseFloat(e.target.value) || null,
                      }))
                    }
                    placeholder="Insira a latitude"
                  />
                </div>

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Longitude</p>
                  <input
                    id="longitude"
                    type="number"
                    className={styles.Field}
                    value={coordinates.lng || ""}
                    onChange={(e) =>
                      setCoordinates((prev) => ({
                        ...prev,
                        lng: parseFloat(e.target.value) || null,
                      }))
                    }
                    placeholder="Insira a longitude"
                  />
                </div>
              </div>

              <div className={styles.InputContainer}>
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

                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Senha para frentistas</p>
                  <input
                    id="password"
                    type="text"
                    className={styles.Field}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

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
                      <option value="DESATIVADO">DESATIVADO</option>
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
            </div>
          </div>

          <div className={styles.Copyright}>
            <p className={styles.Copy}>
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
