import HeaderHome from "@/components/HeaderReportsSupervisors";
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

  useEffect(() => {
    let isComponentMounted = true;

    const fetchManagers = async () => {
      if (post) {
        try {
          const q = query(collection(db, "POSTS"), where("name", "==", post));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const postData = querySnapshot.docs[0].data();

            if (postData && postData.supervisors) {
              const managersData = postData.supervisors;
              setManagers(managersData);
              console.log(managers);
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
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap');
        `}</style>
        <title>Rede Plug</title>
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
                    pathname: "/reports/supervisors-date",
                    query: {
                      post: router.query.post,
                      // @ts-ignore
                      supervisorName: manager.name,
                    },
                  }}
                >
                  <div className={styles.CardMenu}>
                    <img src="/supervisoresHome.svg" alt="Gerente" />
                    <span className={styles.CardMenuText}>
                      {
                        // @ts-ignore
                        manager.name
                      }
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.Copyrigt}>
            <p className={styles.Copy}>
              © Rede Plug 2024, todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
