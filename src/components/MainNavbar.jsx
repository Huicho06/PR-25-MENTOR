import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.png";
import { FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BottomNavLogout from "../components/SignOut"; // Ajusta la ruta según sea necesario
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  
  const navigate = useNavigate();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const modalRef = useRef(null); // Referencia para detectar clics fuera
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const handleViewProfile = () => {
    navigate("/ProfileScreen");
  };
   const scrollToRequest = (id) => {
    const target = document.getElementById(`solicitud-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.backgroundColor = "#14532d"; // Verde fuerte
      setTimeout(() => {
        target.style.backgroundColor = "";
      }, 2000);
    }
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

  const [notifications, setNotifications] = useState([]);
const [user, setUser] = useState(null);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
    if (firebaseUser) {
      setUser(firebaseUser);
    }
  });
  return () => unsubscribe();
}, []);

// Función para obtener solicitudes pendientes del usuario
  const fetchSolicitudes = async () => {
    if (!user) return;  // seguridad extra
    try {
      const q = query(
        collection(db, "solicitudes"),
        where("tutor_uid", "==", user.uid),
        where("estado", "==", "pendiente")
      );
      const querySnapshot = await getDocs(q);
      const fetchedNotifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        message: `Solicitud de mentoría de ${doc.data().proyecto_integrantes?.join(", ") ?? "Sin integrantes"} pendiente`,
      }));
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    }
  };

 // Ejecutar fetchSolicitudes solo cuando user cambia y NO es null
  useEffect(() => {
    if (user) {
      fetchSolicitudes();
    } else {
      setNotifications([]);  // Limpiar notificaciones si no hay usuario
    }
  }, [user]);

  
// Mostrar punto rojo si hay notificaciones y el modal NO está abierto
  useEffect(() => {
    if (notifications.length > 0 && !isNotificationModalOpen) {
      setHasNewNotifications(true);
    } else {
      setHasNewNotifications(false);
    }
  }, [notifications, isNotificationModalOpen]);

  // Toggle modal notificaciones y limpiar indicador
  const toggleNotificationModal = () => {
    setIsNotificationModalOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setHasNewNotifications(false);
      }
      return nextState;
    });
  };
  fetchSolicitudes();
  return (
    <div style={styles.navBar}>
      <img src={logo} alt="Logo Mentor" style={styles.logo} />
      <div style={styles.rightNav}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative" }}>
  <FaBell style={styles.bellIcon} onClick={toggleNotificationModal} />
  {hasNewNotifications && <div style={styles.notificationDot}></div>}
</div>

          {isNotificationModalOpen && (
            <div ref={modalRef} style={styles.notificationModal}>
              <h2 style={{ marginTop: 0 }}>Notificaciones</h2>
              <div style={styles.notificationContent}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={styles.notificationItem}
                    onClick={() => scrollToRequest(notification.id)} 
                  >
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
  width: "400px", // ← antes 300px
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
  notificationDot: {
  position: "absolute",
  top: "0px",
  right: "10px",
  width: "10px",
  height: "10px",
  backgroundColor: "#f44336", // rojo
  borderRadius: "50%",
  zIndex: 10,
}

};

export default Navbar;
