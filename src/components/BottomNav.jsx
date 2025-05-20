import React, { useState, useEffect } from "react";
import { FaHome, FaComments, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const BottomNav = () => {
  const navigate = useNavigate(); // Hook de navegación de react-router-dom
  const location = useLocation(); // Hook para obtener la ubicación actual

  const [activeTab, setActiveTab] = useState("home"); // Estado para manejar el tab activo

  // Cambiar el tab activo según la ruta actual
  useEffect(() => {
    const path = location.pathname.toLowerCase();
  
    if (path === "/main" || path === "/studenthome") {
      setActiveTab("home");
    } else if (path.includes("chatscreen") || path.includes("taskscreen")) {
      setActiveTab("chats");
    } else if (path === "/profilescreen") {
      setActiveTab("profile");
    } else {
      setActiveTab(null);
    }
  }, [location]);
  

  // Función para manejar la navegación
  const handleNavigation = async (tab) => {
    setActiveTab(tab); // Actualiza el tab activo
      const auth = getAuth();
    const user = auth.currentUser;

    if (tab === "home") {
      if (user) {
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (userData?.proyecto) {
          const solicitudQuery = query(
            collection(db, "solicitudes"),
            where("proyecto_integrantes_ids", "array-contains", user.uid),
            where("estado", "==", "aceptado")
          );

          const solicitudSnap = await getDocs(solicitudQuery);

          if (!solicitudSnap.empty) {
            navigate("/StudentHome"); // Proyecto aceptado
            return;
          }
        }
      }
      navigate("/main"); // Aún no aceptado o no tiene proyecto
    } else if (tab === "profile") {
      navigate("/ProfileScreen");
    } else if (tab === "chats") {
      navigate("/ChatScreen");
    }
  };

  return (
    <div style={styles.navBar}>
      <div
        style={activeTab === "home" ? styles.activeNavItem : styles.navItem} // Cambia el estilo si el tab está activo
        onClick={() => handleNavigation("home")}
      >
        <FaHome style={styles.icon} />
        <span>Principal</span>
      </div>

      <div
        style={activeTab === "chats" ? styles.activeNavItem : styles.navItem} // Cambia el estilo si el tab está activo
        onClick={() => handleNavigation("chats")}
      >
        <FaComments style={styles.icon} />
        <span>Chats</span>
      </div>

      <div
        style={activeTab === "profile" ? styles.activeNavItem : styles.navItem} // Cambia el estilo si el tab está activo
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
  activeNavItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#1ed760", // Color verde para el tab activo
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px", // Un tamaño de ícono un poco mayor
    marginBottom: "5px",
  },
};

export default BottomNav;
