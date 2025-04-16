import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Logo de la app
import { FaBell, FaUser } from "react-icons/fa"; // Para los iconos de la campanita y el usuario
import BottomNav from "../components/BottomNavTeacher"; // Importa el componente BottomNav

const MainScreenTeacher = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mentors, setMentors] = useState([
    { name: "Jesus Espejo", project: "Green Portalito", career: "Engineering", message: "Estimado docente, me encantaría aprender más sobre el desarrollo web y la programación móvil. Adjunto un documento explicativo con mis trabajos previos.", file: "document.pdf" },
    { name: "Marcelo Mena", project: "Green Portalote", career: "Architecture", message: "Hola, soy Marcelo Mena, me gustaría discutir más sobre los proyectos que he desarrollado en el área de arquitectura. He adjuntado un archivo con ejemplos.", file: "document.pdf" },
    // Agregar más mentores aquí si es necesario
  ]); // Simulación de datos de mentores

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [message, setMessage] = useState(""); // Estado para el mensaje
  const [file, setFile] = useState(null); // Estado para el archivo adjunto
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Modal de detalles
  const [selectedMentor, setSelectedMentor] = useState(null); // Mentor seleccionado para ver detalles

  // Estado de las notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva solicitud de mentoría de Ramal Cart" },
    { id: 2, message: "Has recibido un mensaje de Mary Jones" },
    { id: 3, message: "Angela Mohammed actualizó su perfil" },
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewProfile = () => {
    navigate("/ProfileScreen"); // Redirige al perfil
  };

  const handleAcceptRequest = (mentor) => {
    console.log(`Solicitud aceptada de ${mentor.name}`);
  };

  const handleRejectRequest = (mentor) => {
    console.log(`Solicitud rechazada de ${mentor.name}`);
  };

  const handleViewDetails = (mentor) => {
    setSelectedMentor(mentor); // Selecciona el mentor para mostrar los detalles
    setIsDetailsModalOpen(true); // Abre el modal de detalles
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false); // Cierra el modal de detalles
    setSelectedMentor(null); // Limpia el mentor seleccionado
  };

  const handleDownloadFile = (fileName) => {
    const link = document.createElement("a");
    link.href = `/path/to/your/files/${fileName}`; // Cambia esta ruta con la ruta correcta al archivo
    link.download = fileName;
    link.click();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.navBar}>
        {/* Logo */}
        <img src={logo} alt="Logo Mentor" style={styles.logo} />
        <div style={styles.rightNav}>
          <FaBell
            style={styles.bellIcon}
            onClick={() => setIsNotificationModalOpen(true)} // Abre el modal de notificaciones
          />
          <FaUser style={styles.userIcon} onClick={handleViewProfile} />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.Solicitudes}>
          <h1>Solicitudes</h1>
        </div>

        {/* Resultados */}
        <div style={styles.resultContainer}>
          <div style={styles.mentorList}>
            {mentors.map((mentor, index) => (
              <div key={index} style={styles.mentorCard}>
                <img
                  src={"../assets/logo.png"}
                  alt={mentor.name}
                  style={styles.mentorImage}
                />
                <div style={styles.mentorInfo}>
                  <h3 style={styles.mentorName}>{mentor.name}</h3>
                  <p style={styles.mentorSpecialization}>Proyecto: {mentor.project}</p>
                </div>
                <div style={styles.requestButtonsContainer}>
                  <button
                    style={styles.acceptButton}
                    onClick={() => handleAcceptRequest(mentor)}
                  >
                    Aceptar
                  </button>
                  <button
                    style={styles.rejectButton}
                    onClick={() => handleRejectRequest(mentor)}
                  >
                    Rechazar
                  </button>
                  <button
                    style={styles.detailsButton}
                    onClick={() => handleViewDetails(mentor)}
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
            <p style={styles.message}><strong>Mensaje:</strong> {selectedMentor.message} </p>
            <p><strong>Archivo:</strong> 
              <button
                onClick={() => handleDownloadFile(selectedMentor.file)}
                style={styles.downloadButton}
              >
                Descargar {selectedMentor.file}
              </button>
            </p>
            <div style={styles.modalButtons}>
              <button onClick={handleCloseDetailsModal} style={styles.modalButton1}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mantener el BottomNav */}
      <BottomNav />
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
  },
  modalButtons: {
    display: "flex",
    justifyContent: "center",
  },
  modalButton1: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#f44336", // Verde para aceptar
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
};

export default MainScreenTeacher;
