import HeaderHome from "@/components/HeaderReports";
import SideMenuHome from "@/components/SideMenuHome";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import styles from "../../styles/Home.module.scss";

export default function Home() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isComponentMounted = true;
    const fetchData = async () => {
      const path = "POSTS";

      const dbCollection = collection(db, path);
      const postsSnapshot = await getDocs(dbCollection);
      const postsList = postsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
        };
      });

      if (isComponentMounted) {
        // @ts-ignore
        setPosts(postsList);
        console.log("Set data: ", postsList);
      }
    };
    fetchData();

    return () => {
      isComponentMounted = false;
    };
  }, []);

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
              {posts.map((post, index) => (
                <Link
                  href={`/reports/functions?post=${encodeURIComponent(
                    // @ts-ignore
                    post.name
                  )}`}
                  key={index}
                >
                  <div className={styles.CardMenu}>
                    <img src="./postosHome.svg" alt="Posto" />
                    <span className={styles.CardMenuText}>
                      {
                        // @ts-ignore
                        post.name
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
