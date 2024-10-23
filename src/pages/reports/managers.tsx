import HeaderHome from "@/components/HeaderReportsManagers";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const post = router.query.post;

  const [openMenu, setOpenMenu] = useState(false);
  const [managers, setManagers] = useState([]);

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
    let isComponentMounted = true;

    const fetchManagers = async () => {
      if (post) {
        try {
          const q = query(collection(db, "POSTS"), where("name", "==", post));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data();

            if (postData && postData.managers) {
              // Extrair os gerentes do campo 'managers'
              const managersData = postData.managers;
              setManagers(managersData);
            }
          }
        } catch (error) {
          console.error("Error fetching managers:", error);
        }
      }
    };

    fetchManagers();

    return () => {
      isComponentMounted = false;
    };
  }, [post]);

  return (
    <>
      <Head>
        <style>{`
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
`}</style>

        <title>Rede Postos</title>
      </Head>

      <div className={styles.Container}>
        <SideMenuHome
          activeRoute={router.pathname}
          openMenu={openMenu}
        ></SideMenuHome>

        <div className={styles.OrderContainer}>
          <HeaderHome></HeaderHome>
          <div className={styles.CardsMenusContainer}>
            <div className={styles.CardsMenus}>
              {managers.map((manager, index) => (
                <Link
                  key={index}
                  href={{
                    pathname: "/reports/managers-date",
                    query: {
                      post: router.query.post,
                      // @ts-ignore
                      managerName: manager.managerName,
                    },
                  }}
                >
                  <div className={styles.CardMenu}>
                    <img src="/supervisoresHome.svg" alt="Gerente" />
                    <span className={styles.CardMenuText}>
                      {
                        // @ts-ignore
                        manager.managerName
                      }
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.Copyrigt}>
            <p className={styles.Copy}>
              © Rede Postos 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
