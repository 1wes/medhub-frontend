import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkToken, logout } from "../utils/auth";

export const useAuthRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const valid = await checkToken();

      const isLoginPage = location.pathname === "/login";

      if (isLoginPage && valid) {
        navigate("/", { replace: true });
      } else if (!isLoginPage && !valid) {
        logout();
      }
    };

    verify();
  }, [location.pathname, navigate]);
};
