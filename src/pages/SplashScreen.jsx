import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import splashImg from "../assets/splash.png";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
        navigate("/welcome");
    }, 3000); // 3 segundos
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={{
      height: "100vh",
      backgroundColor: "#ffffff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <img src={splashImg} alt="Splash Mentor" style={{ width: 250 }} />
    </div>
  );
};

export default SplashScreen;
