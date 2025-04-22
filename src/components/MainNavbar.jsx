import React, { useState } from "react";
import logo from "../assets/logo.png"; // Logo de la app
import { FaBell, FaUser } from "react-icons/fa"; // Para los iconos de la campanita y el usuario

import { FaSearch } from "react-icons/fa"; // Icono de búsqueda

import { useNavigate } from "react-router-dom"; // Para la navegación

const Navbar = () => {

  const [activeTab, setActiveTab] = useState("chat"); // Estado para manejar qué botón está activo
  const [searchTerm, setSearchTerm] = useState(""); // Para la barra de búsqueda
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para cambiar el estado del botón activo
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

    // Maneja la apertura del modal de notificaciones
    const handleOpenNotificationModal = () => {
      console.log("abriendo modal");
      
      setIsNotificationModalOpen(true); // Abre el modal de notificaciones
    };
  
    // Maneja el cierre del modal de notificaciones
    const handleCloseNotificationModal = () => {
      setIsNotificationModalOpen(false); // Cierra el modal de notificaciones
    };
    const handleViewProfile = () => {
      navigate("/ProfileScreen"); // Redirige al perfil
    };
  
  // Estado de las notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva solicitud de mentoría de Ramal Cart" },
    { id: 2, message: "Has recibido un mensaje de Mary Jones" },
    { id: 3, message: "Angela Mohammed actualizó su perfil" },
  ]);

  
  return (
      <div style={styles.navBar}>
        {/* Logo */}
        <img src={logo} alt="Logo Mentor" style={styles.logo} />
        <div style={styles.rightNav}>
          <FaBell
            style={styles.bellIcon}
            onClick={handleOpenNotificationModal} // Abre el modal de notificaciones al hacer clic en el icono
          />
          {/* Botón de usuario para redirigir al perfil */}
          <FaUser style={styles.userIcon} onClick={handleViewProfile} />
        </div>
        {/* Modal de notificaciones */}
      {isNotificationModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.notificationModal}>
            <h2>Notificaciones</h2>
            <div style={styles.notificationContent}>
              {notifications.map((notification) => (
                <div key={notification.id} style={styles.notificationItem}>
                  <div style={styles.notificationIcon}></div>
                  <p style={styles.notificationMessage}>{notification.message}</p>
                </div>
              ))}
            </div>
            <button onClick={handleCloseNotificationModal} style={styles.modalButton2}>
              Cerrar
            </button>
          </div>
        </div>
      )}
      </div>

  );
};

const styles = {
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
  },
  logo: {
    width: 120,
  },
  rightNav: {
    display: "flex",
    alignItems: "center",
  },
  bellIcon: {
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    marginRight: "20px", // Espaciado entre los iconos
  },
  userIcon: {
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  notificationModal: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "400px",
    color: "#fff",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)", // Sombra para resaltar el modal
  },
  notificationContent: {
    marginBottom: "15px",
  },
  notificationItem: {
    backgroundColor: "#333", // Fondo de cada notificación
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  },
  notificationIcon: {
    width: "15px",
    height: "15px",
    backgroundColor: "#1ed760", // Un icono circular para las notificaciones
    borderRadius: "50%",
    marginRight: "15px",
  },
  notificationMessage: {
    fontSize: "1rem",
    color: "#ccc",
  },
};

export default Navbar;
