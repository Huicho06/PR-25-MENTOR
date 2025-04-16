import React from "react";
import { FaHome, FaComments, FaUser } from "react-icons/fa"; // Para los iconos
import { useNavigate } from "react-router-dom"; // Para la navegación

const BottomNav = () => {
  const navigate = useNavigate(); // Hook de navegación de react-router-dom

  // Función para manejar la navegación
  const handleNavigation = (tab) => {
    if (tab === "home") {
      navigate("/mainTeacher"); // Redirige al MainScreen
    } else if (tab === "profile") {
      navigate("/ProfileScreenTeacher"); // Redirige a la página de perfil
    } else if (tab === "chats") {
      navigate("/chats"); // Redirige a la página de Chats (si es necesario)
    }
  };

  return (
    <div style={styles.navBar}>
      <div
        style={styles.navItem}
        onClick={() => handleNavigation("home")}
      >
        <FaHome style={styles.icon} />
        <span>Principal</span>
      </div>

      <div
        style={styles.navItem}
        onClick={() => handleNavigation("chats")}
      >
        <FaComments style={styles.icon} />
        <span>Chats</span>
      </div>

      <div
        style={styles.navItem}
        onClick={() => handleNavigation("profile")}
      >
        <FaUser style={styles.icon} />
        <span>Mi Perfil</span>
      </div>
    </div>
  );
};

const styles = {
  navBar: {
    display: "flex",
    justifyContent: "space-around", // Distribuye los íconos uniformemente
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    position: "fixed",
    bottom: 0,
    left: 0, // Asegura que se alinee bien a la izquierda
    width: "100%",
    padding: "10px 0",
    zIndex: 1000,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px", // Esquinas redondeadas
    boxSizing: "border-box",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px", // Un tamaño de ícono un poco mayor
    marginBottom: "5px",
  },
};

export default BottomNav;
