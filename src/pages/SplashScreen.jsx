import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import splashImg from "../assets/Group 967.png"; // Ruta de la imagen
import "./styles/SplashScreen.css"; // Asegúrate de importar el CSS con las animaciones

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/welcome");
    }, 3000); // 3 segundos antes de redirigir
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="splash-wrapper">
      <img
        src={splashImg}
        alt="Splash Mentor"
        className="splash-image"
      />
    </div>
  );
};

export default SplashScreen;
