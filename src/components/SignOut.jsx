import React from "react";
import { FaSignOutAlt } from "react-icons/fa"; // Ícono de cerrar sesión
import { useNavigate } from "react-router-dom"; // Para la navegación
import { signOut } from "firebase/auth"; // Para el cierre de sesión en Firebase
import { auth } from "/src/services/firebase"; // Asegúrate de tener la configuración de Firebase

const BottomNavLogout = () => {
  const navigate = useNavigate(); // Hook de navegación de react-router-dom

  // Función para manejar la navegación
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión de Firebase
      console.log("Sesión cerrada con éxito");
      navigate("/login"); // Redirige a la pantalla de login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <div style={styles.navBar}>
      <div
        style={styles.navItem}
        onClick={handleLogout} // Llama a la función para cerrar sesión
      >
        <FaSignOutAlt style={styles.icon} />
      </div>
    </div>
  );
};

const styles = {
    navItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#fff",
      cursor: "pointer",
    },
    icon: {
      fontSize: "24px", // Un tamaño de ícono adecuado
      marginBottom: "5px",
    },
  };

export default BottomNavLogout;
