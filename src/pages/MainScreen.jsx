import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // Logo de la app
import { FaBell, FaUser } from "react-icons/fa"; // Para los iconos de la campanita y el usuario
import { FiFilter } from "react-icons/fi"; // Para el nuevo icono de filtro
import BottomNav from "../components/BottomNav"; // Importa el componente BottomNav

const MainScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mentors, setMentors] = useState([
    { name: "Ramal Cart", specialization: "Graphic Design", career: "Engineering" },
    { name: "Mary Jones", specialization: "Web Design", career: "Architecture" },
    { name: "Angela Mohammed", specialization: "UX/UI Design", career: "Engineering" },
    { name: "Siya Dhawal", specialization: "Graphic Design", career: "Design" },
    { name: "Camila Liam", specialization: "Illustration", career: "Arts" },
  ]); // Simulación de datos de mentores

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [message, setMessage] = useState(""); // Estado para el mensaje
  const [file, setFile] = useState(null); // Estado para el archivo adjunto
  const [selectedCareer, setSelectedCareer] = useState(""); // Estado para la carrera seleccionada
  const [selectedSpecialization, setSelectedSpecialization] = useState(""); // Estado para el área de especialización
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones

  // Estado de las notificaciones
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva solicitud de mentoría de Ramal Cart" },
    { id: 2, message: "Has recibido un mensaje de Mary Jones" },
    { id: 3, message: "Angela Mohammed actualizó su perfil" },
  ]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMentors = mentors.filter((mentor) => {
    return (
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCareer ? mentor.career === selectedCareer : true) &&
      (selectedSpecialization ? mentor.specialization === selectedSpecialization : true)
    );
  });

  const handleViewProfile = () => {
    navigate("/ProfileScreen"); // Redirige al perfil
  };

  // Maneja la apertura del modal de solicitud
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Maneja el cierre del modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Maneja el envío del formulario en el modal
  const handleSendRequest = () => {
    console.log("Mensaje:", message);
    console.log("Archivo adjunto:", file);
    setIsModalOpen(false); // Cierra el modal después de enviar
  };

  // Maneja la apertura del modal de notificaciones
  const handleOpenNotificationModal = () => {
    setIsNotificationModalOpen(true); // Abre el modal de notificaciones
  };

  // Maneja el cierre del modal de notificaciones
  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false); // Cierra el modal de notificaciones
  };

  return (
    <div style={styles.wrapper}>
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
      </div>

      <div style={styles.container}>
        {/* Barra de búsqueda */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search Mentors"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        {/* Filtros: Carrera y Especialización */}
        <div style={styles.filterContainer}>
          <div>
            <label style={styles.filterLabel}>Carrera:  </label>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              style={styles.selectInput}
            >
              <option value="">Selecciona una carrera</option>
              <option value="Engineering">Ingeniería</option>
              <option value="Arts">Artes</option>
              <option value="Design">Diseño</option>
              <option value="Architecture">Arquitectura</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>Área de Especialización:  </label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              style={styles.selectInput}
            >
              <option value="">Selecciona una especialización</option>
              <option value="Graphic Design">Diseño Gráfico</option>
              <option value="Web Design">Diseño Web</option>
              <option value="UX/UI Design">UX/UI</option>
              <option value="Illustration">Ilustración</option>
            </select>
          </div>
        </div>

        {/* Resultados */}
        <div style={styles.resultContainer}>
          <div style={styles.mentorList}>
            {filteredMentors.map((mentor, index) => (
              <div key={index} style={styles.mentorCard}>
                <img
                  src={"../assets/logo.png"}
                  alt={mentor.name}
                  style={styles.mentorImage}
                />
                <div style={styles.mentorInfo}>
                  <h3 style={styles.mentorName}>{mentor.name}</h3>
                  <p style={styles.mentorSpecialization}>{mentor.specialization}</p>
                </div>
                <button style={styles.requestButton} onClick={handleOpenModal}>
                  Enviar Solicitud
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

 {/* Modal para enviar solicitud */}
 {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Enviar Solicitud</h2>
            <div style={styles.modalContent}>
              <textarea
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={styles.textarea}
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.fileInput}
              />
              <div style={styles.modalButtons}>
                <button onClick={handleSendRequest} style={styles.modalButton1}>
                  Enviar
                </button>
                <button onClick={handleCloseModal} style={styles.modalButton2}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

      {/* Agregar el BottomNav aquí */}
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
  selectInput: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    backgroundColor: "#333", // Fondo oscuro
    color: "#fff", // Color del texto
    border: "1px solid #ccc",
  },
  filterContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  filterLabel: {
    fontSize: "1rem",
    color: "#fff",
    marginBottom: "5px",
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
    marginRight: "20px", // Espaciado entre los iconos
  },
  userIcon: {
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  container: {
    padding: "20px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: "30px",
    padding: "5px 15px",
    marginBottom: "30px",
    justifyContent: "space-between", // Ajuste para que el filtro se acomode al lado derecho
  },
  searchInput: {
    padding: "10px 20px",
    borderRadius: "30px",
    color: "#fff",
    border: "none",
    backgroundColor: "#1a1a1a",
    width: "100%",
  },
  resultContainer: {
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
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  mentorSpecialization: {
    fontSize: "1rem",
    color: "#ccc",
  },
  requestButton: {
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "1rem",
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
  modalContent: {
    display: "flex",
    flexDirection: "column",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "1rem",
    resize: "none",
    border: "1px solid #ccc",
    backgroundColor: "#333",
    color: "#fff",
  },
  fileInput: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    backgroundColor: "#333",
    border: "1px solid #ccc",
    color: "#fff",
  },
  modalButtons: {
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
};

export default MainScreen;
