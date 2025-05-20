import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import logo from "../assets/logo.png";
import BottomNavLogout from "../components/SignOut";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,orderBy, limit
} from "firebase/firestore";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showRechazoModal, setShowRechazoModal] = useState(false);
  const [rechazoDetalle, setRechazoDetalle] = useState(null);
  const [showAceptadoModal, setShowAceptadoModal] = useState(false);
  const [aceptadoDetalle, setAceptadoDetalle] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchNotifications(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNotifications = async (uid) => {
  const q = query(
    collection(db, "notificaciones"),
    where("uid", "==", uid),
    orderBy("timestamp", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(q);
  const notis = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setNotificaciones(notis);
  setHasNewNotifications(notis.some(n => !n.leido));
};
const tiempoDesde = (timestamp) => {
  if (!timestamp?.toDate) return "";
  const date = timestamp.toDate();
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // en segundos

  if (diff < 60) return `hace ${diff} segundos`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;

  const dias = Math.floor(diff / 86400);
  if (dias === 1) return "ayer";

  if (now.getFullYear() !== date.getFullYear()) {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  } else {
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
  }
};


  const marcarComoLeidas = async () => {
    for (const noti of notificaciones) {
      const ref = doc(db, "notificaciones", noti.id);
      await updateDoc(ref, { leido: true });
    }
    setHasNewNotifications(false);
  };
const colorCampana = () => {
  const noLeidas = notificaciones.filter(n => !n.leido);

  if (noLeidas.some(n => n.tipo === "rechazo")) return "#f44336"; // rojo
  if (noLeidas.some(n => n.tipo === "aceptado")) return "#1ed760"; // verde

  return "#fff"; // todas leídas
};

  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(prev => !prev);
    if (!isNotificationModalOpen) {
      marcarComoLeidas();
    }
  };

  const handleViewProfile = () => {
    navigate("/ProfileScreen");
  };
  

  // Cierra modal si se hace clic fuera
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

  const handleNotificationClick = (notification) => {
  if (notification.tipo === "rechazo") {
    setRechazoDetalle(notification);
    setShowRechazoModal(true);
    setIsNotificationModalOpen(false);
  } else if (notification.tipo === "aceptado") {
    setAceptadoDetalle(notification);
    setShowAceptadoModal(true);
    setIsNotificationModalOpen(false);
  }
};



  const handleCloseRechazoModal = async () => {
    if (rechazoDetalle) {
      await updateDoc(doc(db, "notificaciones", rechazoDetalle.id), {
        leido: true,
      });
    }
    setShowRechazoModal(false);
    setRechazoDetalle(null);
    fetchNotifications(user?.uid); // actualizar lista
  };
  const handleCloseAceptadoModal = async () => {
  if (aceptadoDetalle) {
    await updateDoc(doc(db, "notificaciones", aceptadoDetalle.id), {
      leido: true,
    });
  }
  setShowAceptadoModal(false);
  setAceptadoDetalle(null);
  navigate("/StudentHome "); // ✅
};


  return (
    <div style={styles.navBar}>
      <img src={logo} alt="Logo Mentor" style={styles.logo} />
      <div style={styles.rightNav}>
        <div style={{ position: "relative" }}>
          <FaBell
            style={{
              ...styles.bellIcon,
              color: colorCampana()
            }}
            onClick={toggleNotificationModal}
          />
          {isNotificationModalOpen && (
            <div ref={modalRef} style={styles.notificationModal}>
              <h3 style={{ marginTop: 0 }}>Notificaciones</h3>
              <div style={styles.notificationContent}>
                {notificaciones.length === 0 ? (
                  <p style={{ color: "#aaa" }}>No tienes notificaciones</p>
                ) : (
                  notificaciones.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      style={{
                        ...styles.notificationItem,
                        backgroundColor: n.leido
                          ? "#2a2a2a" // fondo neutro si ya fue leída
                          : n.tipo === "rechazo"
                            ? "#4a1e1e"
                            : "#1e4a2a"
                      }}
                    >
                      <div
                        style={{
                          ...styles.notificationIcon,
                          backgroundColor: n.leido
                            ? "#777" // gris si fue leída
                            : n.tipo === "rechazo"
                              ? "#f44336"
                              : "#1ed760"
                        }}
                      ></div>
                      <p style={styles.notificationMessage}>
                        {n.tipo === "rechazo"
                          ? `Tu proyecto "${n.proyecto_nombre}" fue rechazado`
                          : n.tipo === "aceptado"
                            ? `Tu proyecto "${n.proyecto_nombre}" fue aceptado`
                            : "Notificación"}
                        <br />
                        <small style={{ color: "#888" }}>{tiempoDesde(n.timestamp)}</small>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <FaUser style={styles.userIcon} onClick={handleViewProfile} />
        <BottomNavLogout />
      </div>  
      {showRechazoModal && rechazoDetalle && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Proyecto Rechazado</h2>
            <p><strong>Proyecto:</strong> {rechazoDetalle.proyecto_nombre}</p>
            <p><strong>Motivo:</strong> {rechazoDetalle.motivo}</p>
            <button
              style={styles.modalButton1}
              onClick={handleCloseRechazoModal}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}  
        {showAceptadoModal && aceptadoDetalle && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2 style={{ marginTop: 0 }}>¡Proyecto Aceptado! 🎉</h2>
              <p><strong>Proyecto:</strong> {aceptadoDetalle.proyecto_nombre}</p>
              <p>Tu solicitud fue aprobada. ¡Ahora puedes trabajar con tu mentor!</p>
              <button
                style={styles.modalButton1}
                onClick={handleCloseAceptadoModal}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

    </div>    
  );  
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  },
  modal: {
  backgroundColor: "#2a2a2a",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px", // más ancho
  color: "#fff",
  boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.6)",
  lineHeight: "1.7", // más separación de texto
  fontSize: "1.1rem"
},
  modalButton1: {
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: "15px"
  },
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
    maxHeight: "250px",
    overflowY: "auto",
  },
  notificationItem: {
    backgroundColor: "#333",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
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
