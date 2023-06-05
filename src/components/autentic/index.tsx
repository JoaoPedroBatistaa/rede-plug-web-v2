import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children }: any) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      // Coloque aqui a lógica para verificar se o usuário está autenticado
      // Por exemplo, verificar se há um token de autenticação no localStorage

      const token = localStorage.getItem("token"); // Exemplo: obtenção do token de autenticação do localStorage

      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push("/login");
      }
    };

    checkAuthentication();
  }, []);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
