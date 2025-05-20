import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Logo de la app
import { FaBell, FaUser } from "react-icons/fa"; // Para los iconos de la campanita y el usuario
import BottomNavTeacher from "../components/BottomNavTeacher"; // Importa el componente BottomNav
import MainNavbar from "../components/MainNavbar"; // Importa el componente BottomNav
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // ajusta la ruta según dónde lo creaste
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import personImage from "../assets/person.png"; 
import BottomNavLogout from "../components/SignOut";
import { onAuthStateChanged } from "firebase/auth";

const MainScreenTeacher = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user) return;
  
    const fetchSolicitudes = async () => {
      try {
        const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
        const q = query(
          collection(db, "solicitudes"),
          where("tutor_uid", "==", user.uid),
          where("estado", "==", "pendiente")
        );
  
        const querySnapshot = await getDocs(q);
        const fetchedRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setRequests(fetchedRequests);
  
        // Crear notificaciones dinámicas
        const notificacionesGeneradas = fetchedRequests.map((solicitud) => ({
          id: solicitud.id,
          message: `Solicitud de mentoría de ${solicitud.proyecto_integrantes?.join(", ")} pendiente`,
        }));
  
        setNotifications(notificacionesGeneradas);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };
  
    fetchSolicitudes();
  }, [user]);
  useEffect(() => {
  window.scrollToRequest = (id) => {
    const target = document.getElementById(`solicitud-${id}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.style.backgroundColor = "#14532d"; // Verde fuerte
      setTimeout(() => {
        target.style.backgroundColor = ""; // Lo quita después de 2s
      }, 2000);
    }
  };
}, []);

const existeChatEntre = async (uid1, uid2) => {
  const q = query(
    collection(db, "chats"),
    where("tipo", "==", "compañero"),
    where("participantes", "array-contains", uid1)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.some(doc => {
    const data = doc.data();
    return (
      data.participantes.includes(uid2) &&
      data.participantes.length === 2
    );
  });
};

const crearChatsProyectoAceptado = async (proyecto) => {
  const { proyecto_integrantes_ids = [], tutor_uid, proyecto_nombre } = proyecto;

  for (const estudiante of proyecto_integrantes_ids) {
    // Chat consigo mismo
    await addDoc(collection(db, "chats"), {
      participantes: [estudiante],
      nombre: "Notas personales",
      creado_en: serverTimestamp(),
      tipo: "personal"
    });

    // Chat estudiante - tutor
    await addDoc(collection(db, "chats"), {
      participantes: [estudiante, tutor_uid],
      nombre: `Chat con tutor`,
      creado_en: serverTimestamp(),
      tipo: "tutor_estudiante"
    });
  }

    // Chat con compañero si hay más de 1
    for (let i = 0; i < proyecto_integrantes_ids.length; i++) {
    for (let j = i + 1; j < proyecto_integrantes_ids.length; j++) {
      const uid1 = proyecto_integrantes_ids[i];
      const uid2 = proyecto_integrantes_ids[j];

      if (!(await existeChatEntre(uid1, uid2))) {
        await addDoc(collection(db, "chats"), {
          nombre: "Chat con tu compañero",
          participantes: [uid1, uid2],
          tipo: "compañero",
          creado_en: serverTimestamp(),
        });
      }
    }
  }

  // Chat grupal: todos los estudiantes + tutor
  await addDoc(collection(db, "chats"), {
    participantes: [...proyecto_integrantes_ids, tutor_uid],
    nombre: `Grupo: ${proyecto_nombre}`,
    creado_en: serverTimestamp(),
    tipo: "grupo_proyecto"
  });
};


  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState([]);

  const [mentors, setMentors] = useState([
    //{ name: "Jesus Espejo", project: "Green Portalito", career: "Engineering", message: "Estimado docente, me encantaría aprender más sobre el desarrollo web y la programación móvil. Adjunto un documento explicativo con mis trabajos previos.", file: "document.pdf" },
    //{ name: "Marcelo Mena", project: "Green Portalote", career: "Architecture", message: "Hola, soy Marcelo Mena, me gustaría discutir más sobre los proyectos que he desarrollado en el área de arquitectura. He adjuntado un archivo con ejemplos.", file: "document.pdf" },
    // Agregar más mentores aquí si es necesario
  ]); // Simulación de datos de mentores

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [message, setMessage] = useState(""); // Estado para el mensaje
  const [file, setFile] = useState(null); // Estado para el archivo adjunto
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Modal de detalles
  const [selectedMentor, setSelectedMentor] = useState(null); // Mentor seleccionado para ver detalles
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false); // Modal para rechazo
  const [rejectionMessage, setRejectionMessage] = useState(""); // Mensaje de rechazo

  // Estado de las notificaciones
  const [notifications, setNotifications] = useState([]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = () => {
    navigate("/ProfileScreenTeacher"); // Redirige al perfil
  };

  const handleAcceptRequest = async (solicitud) => {
    try {
      const solicitudRef = doc(db, "solicitudes", solicitud.id);
      await updateDoc(solicitudRef, {
        estado: "aceptado",
      });
    
      const integrantesIds = solicitud.proyecto_integrantes_ids || [];
      for (const uid of integrantesIds) {
        await addDoc(collection(db, "notificaciones"), {
        uid,
        tipo: "aceptado",
        proyecto_nombre: solicitud.proyecto_nombre,
        timestamp: serverTimestamp(),
        leido: false,
      });
    }
    await crearChatsProyectoAceptado(solicitud);

      setRequests(prev => prev.filter(r => r.id !== solicitud.id));
      console.log("Solicitud aceptada:", solicitud.id);
    } catch (error) {
      console.error("Error al aceptar solicitud:", error);
    }
  };

  const handleRejectRequest = (mentor) => {
    setSelectedMentor(mentor);
    setIsRejectionModalOpen(true); // Abre el modal de rechazo
  };

  const handleViewDetails = (mentor) => {
    setSelectedMentor(mentor); // Selecciona el mentor para mostrar los detalles
    setIsDetailsModalOpen(true); // Abre el modal de detalles
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false); // Cierra el modal de detalles
    setSelectedMentor(null); // Limpia el mentor seleccionado
  };

  const handleCloseRejectionModal = () => {
    setIsRejectionModalOpen(false); // Cierra el modal de rechazo
    setRejectionMessage(""); // Limpia el mensaje de rechazo
  };

  const handleSubmitRejection = async () => {
    try {
      const solicitudRef = doc(db, "solicitudes", selectedMentor.id);
      await updateDoc(solicitudRef, {
        estado: "rechazado",
        motivo_rechazo: rejectionMessage,
      });
      const integrantesIds = selectedMentor.proyecto_integrantes_ids || [];

for (const uid of integrantesIds) {
  await addDoc(collection(db, "notificaciones"), {
    uid, 
    tipo: "rechazo",
    proyecto_nombre: selectedMentor.proyecto_nombre,
    motivo: rejectionMessage,
    timestamp: serverTimestamp(),
    leido: false,
  });
}

      setRequests(prev => prev.filter(r => r.id !== selectedMentor.id));
      setIsRejectionModalOpen(false);
      setRejectionMessage("");
      console.log("Solicitud rechazada:", selectedMentor.id);
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
    }
  };
  

  const handleDownloadFile = (fileName) => {
    const link = document.createElement("a");
    link.href = `/path/to/your/files/${fileName}`; // Cambia esta ruta con la ruta correcta al archivo
    link.download = fileName;
    link.click();
  };

  // Manejo del modal de notificaciones
 const handleOpenNotificationModal = () => {
  const notificacionesGeneradas = requests.map((solicitud) => ({
    id: solicitud.id,
    message: `Solicitud de mentoría de ${solicitud.proyecto_integrantes?.join(", ") ?? "Sin integrantes"} pendiente`,
  }));

  setNotifications(notificacionesGeneradas);
  setIsNotificationModalOpen(true);
};


  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false); // Cierra el modal de notificaciones
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      
      <div style={styles.container}>
        <div style={styles.Solicitudes}>
          <h1>Solicitudes</h1>
        </div>

        {/* Resultados */}
        <div style={styles.resultContainer}>
          <div style={styles.mentorList}>
          {requests.map((solicitud, index) => (
          <div key={index} id={`solicitud-${solicitud.id}`} style={styles.mentorCard}>
            <img
              src={personImage}
              alt={solicitud.proyecto_nombre}
              style={styles.mentorImage}
            />
            <div style={styles.mentorInfo}>
              <h3 style={styles.mentorName}>{solicitud.proyecto_nombre}</h3>
              <p style={styles.mentorSpecialization}>
                Integrantes: {solicitud.proyecto_integrantes?.join(", ")}
              </p>
            </div>
            <div style={styles.requestButtonsContainer}>
              <button
                style={styles.acceptButton}
                onClick={() => handleAcceptRequest(solicitud)}
              >
                Aceptar
              </button>
              <button
                style={styles.rejectButton}
                onClick={() => handleRejectRequest(solicitud)}
              >
                Rechazar
              </button>
              <button
                style={styles.detailsButton}
                onClick={() => handleViewDetails(solicitud)}
              >
                Detalles
              </button>
            </div>
          </div>
        ))}

          </div>
        </div>
      </div>

      {/* Modal para los detalles */}
      {isDetailsModalOpen && selectedMentor && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h2>Detalles de la Solicitud</h2>

      <p style={styles.message}>
        <strong>Mensaje:</strong> {selectedMentor.mensaje}
      </p>

      {selectedMentor.archivo_url && (
        <p>
          <strong>Archivo:</strong>
          <a
            href={selectedMentor.archivo_url.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.downloadButton}
          >
            Ver archivo
          </a>
        </p>
      )}

      <div style={styles.modalButtons}>
        <button onClick={handleCloseDetailsModal} style={styles.modalButton1}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


      {/* Modal para el rechazo */}
      {isRejectionModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Rechazar Solicitud</h2>
            <textarea
              placeholder="Explica por qué rechazas esta solicitud..."
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              style={styles.textarea}
            />
            <div style={styles.modalButtons}>
              <button
                onClick={handleSubmitRejection}
                style={styles.modalButton1}
              >
                Confirmar
              </button>
              <button
                onClick={handleCloseRejectionModal}
                style={styles.modalButton2}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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


      {/* Mantener el BottomNav */}
      <BottomNavTeacher />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    color: "#fff",
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
  Solicitudes: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "20px",
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
    marginRight: "20px"
  },
  container: {
    padding: "20px",
  },
  resultContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "8px",
  },
  mentorList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  mentorCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: "15px",
    borderRadius: "10px",
    color: "#fff",
    width: "100%",
    justifyContent: "space-between",
  },
  mentorImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "15px",
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: "1.5rem", // Título más grande
    fontWeight: "bold",
    marginBottom: "10px",
  },
  mentorSpecialization: {
    fontSize: "1.2rem",
    color: "#ccc",
  },
  requestButtonsContainer: {
    display: "flex",
    gap: "10px",
  },
  acceptButton: {
    backgroundColor: "#1ed760", // Verde para aceptar
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  rejectButton: {
    backgroundColor: "#f44336", // Rojo para rechazar
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
  detailsButton: {
    backgroundColor: "#00bcd4", // Azul para detalles
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
  },
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
  },
  modal: {
    backgroundColor: "#2a2a2a",
    padding: "20px",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "400px",
    color: "#fff",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
    display: "flex",
    flexDirection: "column",
  },
  modalButtons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
  },
  modalButton1: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
  },
  modalButton2: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
  },
  downloadButton: {
    backgroundColor: "#ff9800", // Naranja para el botón de descarga
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    marginTop: "20px",
    marginBottom: "20px",
    marginLeft: "15px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  textarea: {
    padding: "15px",
    borderRadius: "8px",
    marginTop: "15px",
    fontSize: "1rem",
    resize: "none",
    border: "1px solid #ccc",
    backgroundColor: "#333",
    color: "#fff",
  },
};

export default MainScreenTeacher;
