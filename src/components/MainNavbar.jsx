import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNavLogout from "../components/SignOut"; // Ajusta la ruta según sea necesario

const Navbar = () => {
  const navigate = useNavigate();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const modalRef = useRef(null); // Referencia para detectar clics fuera

  const handleViewProfile = () => {
    navigate("/ProfileScreen");
  };

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen((prev) => !prev);
  };

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsNotificationModalOpen(false);
      }
    };

    if (isNotificationModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationModalOpen]);

  const [notifications] = useState([
    { id: 1, message: "Nueva solicitud de mentoría de Ramal Cart" },
    { id: 2, message: "Has recibido un mensaje de Mary Jones" },
    { id: 3, message: "Angela Mohammed actualizó su perfil" },
  ]);

  return (
    <div style={styles.navBar}>
      <img src={logo} alt="Logo Mentor" style={styles.logo} />
      <div style={styles.rightNav}>
        <div style={{ position: "relative" }}>
          <FaBell style={styles.bellIcon} onClick={toggleNotificationModal} />
          {isNotificationModalOpen && (
            <div ref={modalRef} style={styles.notificationModal}>
              <h2 style={{ marginTop: 0 }}>Notificaciones</h2>
              <div style={styles.notificationContent}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={styles.notificationItem}>
                    <div style={styles.notificationIcon}></div>
                    <p style={styles.notificationMessage}>{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <FaUser style={styles.userIcon} onClick={handleViewProfile} />
        <BottomNavLogout />

      </div>
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
    marginRight: "20px",
  },
  userIcon: {
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    marginRight: "20px",

  },
  notificationModal: {
    position: "absolute",
    top: "30px",
    right: 0,
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
    width: "300px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.6)",
    zIndex: 1000,
  },
  notificationContent: {
    marginTop: "10px",
  },

  notificationItem: {
    backgroundColor: "#333",
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
    backgroundColor: "#1ed760",
    borderRadius: "50%",
    marginRight: "15px",
  },
  notificationMessage: {
    fontSize: "1rem",
    color: "#ccc",
  },
};

export default Navbar;
