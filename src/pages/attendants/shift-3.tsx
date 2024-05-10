require("dotenv").config();

import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../../styles/ProductFoam.module.scss";

import HeaderNewProduct from "@/components/HeaderNewTask";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";

import LoadingOverlay from "@/components/Loading";

export default function NewPost() {
  const router = useRouter();
  const postName = router.query.postName;

  const docId = router.query.docId;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!docId) return;

      try {
        const docRef = doc(db, "ATTENDANTS", docId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          // @ts-ignore
          setData(fetchedData);

          setDate(fetchedData.date);
          setTime(fetchedData.time);
          setAttendant(fetchedData.attendant);
          setEtPrice(fetchedData.etPrice);
          setGcPrice(fetchedData.gcPrice);
          setGaPrice(fetchedData.gaPrice);
          setS10Price(fetchedData.s10Price);
          setEtSales(fetchedData.etSales);
          setGcSales(fetchedData.gcSales);
          setGaSales(fetchedData.gaSales);
          setS10Sales(fetchedData.s10Sales);
          setTotalLiters(fetchedData.totalLiters);
          setCash(fetchedData.cash);
          setDebit(fetchedData.debit);
          setCredit(fetchedData.credit);
          setPix(fetchedData.pix);
          setTotalOutput(fetchedData.totalOutput);
          setTotalInput(fetchedData.totalInput);
          setDifference(fetchedData.difference);
          setObservations(fetchedData.observations);
          setExpenses(fetchedData.expenses);

          console.log(fetchedData); // Verifica se os dados foram corretamente buscados
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [docId]);

  const [isLoading, setIsLoading] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attendant, setAttendant] = useState("");
  const [managerName, setManagerName] = useState("");

  const [isOk, setIsOk] = useState("");
  const [observations, setObservations] = useState("");

  // States para preços
  const [etPrice, setEtPrice] = useState("");
  const [gcPrice, setGcPrice] = useState("");
  const [gaPrice, setGaPrice] = useState("");
  const [s10Price, setS10Price] = useState("");

  // States para vendas de combustíveis
  const [etSales, setEtSales] = useState("");
  const [gcSales, setGcSales] = useState("");
  const [gaSales, setGaSales] = useState("");
  const [s10Sales, setS10Sales] = useState("");
  const [totalLiters, setTotalLiters] = useState("");

  // States para movimento
  const [cash, setCash] = useState("");
  const [debit, setDebit] = useState("");
  const [credit, setCredit] = useState("");
  const [pix, setPix] = useState("");

  // States para total de entrada e saída
  const [totalOutput, setTotalOutput] = useState(0);
  const [totalInput, setTotalInput] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [difference, setDifference] = useState(0);

  const [expenses, setExpenses] = useState([
    { expenseValue: "", expenseType: "" }, // Estado inicial com um item, se necessário
  ]);

  const handleExpenseChange = (
    index: string | number,
    field: string | number,
    value: any
  ) => {
    const newExpenses = [...expenses];
    // @ts-ignore
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { expenseValue: "", expenseType: "" }]);
  };

  const removeExpense = (index: number) => {
    const newExpenses = [...expenses];
    newExpenses.splice(index, 1);
    setExpenses(newExpenses);
  };

  useEffect(() => {
    const total =
      Number(gcPrice) * Number(gcSales) +
      Number(etPrice) * Number(etSales) +
      Number(gaPrice) * Number(gaSales) +
      Number(s10Price) * Number(s10Sales);

    setTotalLiters(
      // @ts-ignore
      Number(gcSales) + Number(etSales) + Number(gaSales) + Number(s10Sales)
    );
    // @ts-ignore
    setTotalOutput(total);
  }, [
    gcPrice,
    gcSales,
    etPrice,
    etSales,
    gaPrice,
    gaSales,
    s10Price,
    s10Sales,
  ]);

  useEffect(() => {
    const totalPayments =
      Number(cash) + Number(debit) + Number(credit) + Number(pix);

    const totalExpenses = expenses.reduce((acc, current) => {
      return acc + Number(current.expenseValue);
    }, 0);

    const total = totalPayments;

    // @ts-ignore
    setTotalInput(total);
  }, [cash, debit, credit, pix, expenses]);

  useEffect(() => {
    const totalExpenses = expenses.reduce((acc, current) => {
      return acc + Number(current.expenseValue);
    }, 0);

    const total = totalExpenses;

    // @ts-ignore
    setTotalExpenses(total);
  }, [expenses]);

  useEffect(() => {
    let total = 0;

    // @ts-ignore
    total = totalOutput - (totalInput + totalExpenses);

    // @ts-ignore
    setDifference(total);
  }, [totalInput, totalOutput, totalExpenses]);

  const saveMeasurement = async () => {
    setIsLoading(true);

    let missingField = "";
    const today = new Date().toISOString().slice(0, 10);

    if (!date) missingField = "Data";
    else if (date !== today) {
      toast.error("Você deve cadastrar a data correta de hoje!");
      setIsLoading(false);

      return;
    } else if (!time) missingField = "Hora";
    // else if (!managerName) missingField = "Nome do supervisor";

    if (missingField) {
      toast.error(`Por favor, preencha o campo obrigatório: ${missingField}.`);
      setIsLoading(false);

      return;
    }

    const userName = localStorage.getItem("userName");

    const managersRef = collection(db, "ATTENDANTS");
    const q = query(
      managersRef,
      where("date", "==", date),
      where("id", "==", "turno-3"),
      where("userName", "==", userName),
      where("postName", "==", postName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      toast.error("O relatório de turno 3 já foi feito hoje!");
      setIsLoading(false);

      return;
    }

    const taskData = {
      date,
      time,
      attendant,
      postName,
      shift: "03",
      etPrice,
      gcPrice,
      gaPrice,
      s10Price,
      etSales,
      gcSales,
      gaSales,
      s10Sales,
      totalLiters,
      cash,
      debit,
      credit,
      pix,
      totalOutput,
      totalInput,
      difference,
      observations,
      expenses,
      id: "turno-3",
    };

    try {
      const docRef = await addDoc(collection(db, "ATTENDANTS"), taskData);
      console.log("Tarefa salva com ID: ", docRef.id);
      toast.success("Tarefa salva com sucesso!");

      await sendMessage(taskData);

      // @ts-ignore
      router.push(`/attendants?post=${encodeURIComponent(postName)}`);
    } catch (error) {
      console.error("Erro ao salvar os dados da tarefa: ", error);
      toast.error("Erro ao salvar a medição.");
    }
  };

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adicionando um dia
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().substr(-2);
    return `${day}/${month}/${year}`;
  }

  async function sendMessage(data: {
    date: any;
    time: any;
    postName: any;
    attendant: any;
    etPrice: any;
    etSales: any;
    gcPrice: any;
    gcSales: any;
    gaPrice: any;
    gaSales: any;
    s10Price: any;
    s10Sales: any;
    totalLiters: any;
    cash: any;
    debit: any;
    credit: any;
    pix: any;
    totalInput: any;
    totalOutput: any;
    difference: any;
    observations: any;
    expenses: any;
  }) {
    const formattedDate = formatDate(data.date);
    // @ts-ignore
    const formattedExpenses = data.expenses
      .map(
        (exp: { expenseType: any; expenseValue: any }) =>
          `Tipo: ${exp.expenseType}, Valor: R$ ${exp.expenseValue}`
      )
      .join("\n");

    const messageBody = `*Novo Relatório de Turno 03:*\n\nData: ${formattedDate}\nHora: ${
      data.time
    }\nPosto: ${data.postName}\nResponsável: ${
      data.attendant
    }\n\n*Vendas*\n\nET: R$ ${Number(data.etPrice) * Number(data.etSales)} (${
      data.etSales
    } litros)\nGC: R$ ${Number(data.gcPrice) * Number(data.gcSales)} (${
      data.gcSales
    } litros)\nGA: R$ ${Number(data.gaPrice) * Number(data.gaSales)} (${
      data.gaSales
    } litros)\nS10: R$ ${Number(data.s10Price) * Number(data.s10Sales)} (${
      data.s10Sales
    } litros)\n\n*Totais*\n\nLitros Vendidos: ${
      data.totalLiters
    }\nDinheiro: R$ ${data.cash}\nDébito: R$ ${data.debit}\nCrédito: R$ ${
      data.credit
    }\nPix: R$ ${data.pix}\nTotal de Entradas: R$ ${
      data.totalInput
    }\nTotal de Saídas: R$ ${data.totalOutput}\nDiferença: R$ ${
      data.difference
    }\n\n*Despesas*\n\n ${formattedExpenses}\n\n\Observações: ${
      data.observations
    }\n`;

    const response = await fetch(
      "https://api.twilio.com/2010-04-01/Accounts/ACb0e4bbdd08e851e23384532bdfab6020/Messages.json",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${process.env.WHATSAPP_API_KEY}`)}`,

          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: "whatsapp:+553899624092",
          From: "whatsapp:+14155238886",
          Body: messageBody,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Falha ao enviar mensagem via WhatsApp");
    }

    console.log("Mensagem enviada com sucesso!");
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
            <p className={styles.BudgetTitle}>Relatório de turno 03</p>
            <div className={styles.BudgetHeadS}>
              {!docId && (
                <button
                  className={styles.FinishButton}
                  onClick={saveMeasurement}
                >
                  <img
                    src="./finishBudget.png"
                    alt="Finalizar"
                    className={styles.buttonImage}
                  />
                  <span className={styles.buttonText}>Cadastrar relatório</span>
                </button>
              )}
            </div>
          </div>

          <p className={styles.Notes}>
            Informe abaixo as informações do relatório
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
              </div>
              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Nome do operador</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={attendant}
                    onChange={(e) => setAttendant(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Preços</p>
              <p className={styles.Notes}>
                Informe abaixo as informações dos preços
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço GC</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={gcPrice}
                    onChange={(e) => setGcPrice(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço ET</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={etPrice}
                    onChange={(e) => setEtPrice(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço GA</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={gaPrice}
                    onChange={(e) => setGaPrice(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Preço S10</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={s10Price}
                    onChange={(e) => setS10Price(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Vendas Combústiveis</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das vendas
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas GC</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={gcSales}
                    onChange={(e) => setGcSales(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas ET</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={etSales}
                    onChange={(e) => setEtSales(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas GA</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={gaSales}
                    onChange={(e) => setGaSales(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Vendas S10</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={s10Sales}
                    onChange={(e) => setS10Sales(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Movimento</p>
              <p className={styles.Notes}>
                Informe abaixo as informações do movimento
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Dinheiro</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Débito</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={debit}
                    onChange={(e) => setDebit(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Crédito</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Pix</p>
                  <input
                    id="attendant"
                    type="text"
                    className={styles.Field}
                    value={pix}
                    onChange={(e) => setPix(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>

              <p className={styles.BudgetTitle}>Despesas</p>
              <p className={styles.Notes}>
                Informe abaixo as informações das despesas
              </p>

              {expenses.map((expense, index) => (
                <div key={index} className={styles.InputContainer}>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Valor da despesa</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={expense.expenseValue}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "expenseValue",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className={styles.InputField}>
                    <p className={styles.FieldLabel}>Tipo de Despesa</p>
                    <input
                      type="text"
                      className={styles.Field}
                      value={expense.expenseType}
                      onChange={(e) =>
                        handleExpenseChange(
                          index,
                          "expenseType",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  {expenses.length > 1 && (
                    <button
                      onClick={() => removeExpense(index)}
                      className={styles.DeleteButton}
                    >
                      <span className={styles.buttonText}>Excluir despesa</span>
                    </button>
                  )}

                  <button onClick={addExpense} className={styles.NewButton}>
                    <span className={styles.buttonText}>Nova despesa</span>
                  </button>
                </div>
              ))}

              <p className={styles.BudgetTitle}>Total</p>
              <p className={styles.Notes}>
                Informe abaixo as informações do total
              </p>

              <div className={styles.InputContainer}>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Total Saída</p>
                  <input
                    id="totalOutput"
                    type="text"
                    className={styles.Field}
                    value={totalOutput.toFixed(2)}
                    onChange={(e) => setTotalOutput(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Total Entrada</p>
                  <input
                    id="totalInput"
                    type="text"
                    className={styles.Field}
                    value={totalInput.toFixed(2)}
                    onChange={(e) => setTotalInput(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Despesas</p>
                  <input
                    id="totalExpenses"
                    type="text"
                    className={styles.Field}
                    value={totalExpenses.toFixed(2)}
                    onChange={(e) =>
                      setTotalExpenses(parseFloat(e.target.value))
                    }
                    placeholder=""
                    disabled
                  />
                </div>
                <div className={styles.InputField}>
                  <p className={styles.FieldLabel}>Diferença</p>
                  <input
                    id="difference"
                    type="text"
                    className={styles.Field}
                    value={difference.toFixed(2)}
                    onChange={(e) => setDifference(parseFloat(e.target.value))}
                    placeholder=""
                    disabled
                  />
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
