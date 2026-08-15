import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../service/api";

const GuestGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await api.get("/auth/me");
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      } finally {
        setChecked(true);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (!checked || authenticated) return;

    if (location.pathname === "/login" || location.pathname === "/signup") {
      return;
    }

    const handleGuestInteraction = (event) => {
      /*
        Only intercept actual interactive elements.
      */
      const interactiveElement = event.target.closest(
        "button, a, input, textarea, select",
      );

      if (!interactiveElement) {
        return;
      }

      /*
        Allow login/signup links.
      */
      const href = interactiveElement.getAttribute("href");

      if (href === "/login" || href === "/signup") {
        return;
      }

      /*
        Stop the original interaction.
      */
      event.preventDefault();
      event.stopPropagation();

      /*
        Send guest to signup.
      */
      navigate("/signup");
    };

    document.addEventListener("click", handleGuestInteraction, true);

    return () => {
      document.removeEventListener("click", handleGuestInteraction, true);
    };
  }, [authenticated, checked, location.pathname, navigate]);

  return children;
};

export default GuestGuard;
