import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase"; // Firebase Firestore
import { getAuth } from "firebase/auth"; // Importar Firebase Auth
import { getDocs, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore"; // Métodos para obtener datos y agregar nuevos
import logo from "../assets/logo.png"; // Logo de la app
import personImage from "../assets/person.png"; // Imagen de perfil predeterminada
import { FaBell, FaUser } from "react-icons/fa"; // Iconos de campanita y usuario
import { FiFilter } from "react-icons/fi"; // Icono de filtro
import BottomNav from "../components/BottomNav"; // Componente de navegación inferior
import BottomNavLogout from "../components/SignOut"; // Ajusta la ruta según sea necesario


const MainScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [mentors, setMentors] = useState([]); // Estado para almacenar los mentores
  const [filteredMentors, setFilteredMentors] = useState([]); // Mentores filtrados
  const [selectedCareer, setSelectedCareer] = useState(""); // Carrera seleccionada
  const [selectedSpecialization, setSelectedSpecialization] = useState(""); // Especialización seleccionada
  const [selectedMentorId, setSelectedMentorId] = useState(null); // Estado para guardar el mentorId


  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de solicitud
  const [message, setMessage] = useState(""); // Estado para el mensaje de la solicitud
  const [file, setFile] = useState(null); // Estado para el archivo adjunto

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Consulta para obtener solo los usuarios de tipo teacher
        const mentorsQuery = query(
          collection(db, "usuarios"),
          where("tipo", "==", "teacher") // Filtramos por tipo "teacher"
        );
        
        const mentorsSnapshot = await getDocs(mentorsQuery);
      const mentorsList = mentorsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id, // Guardamos el ID del documento de Firestore
      }));
        setMentors(mentorsList); // Establecer los mentores en el estado
        setFilteredMentors(mentorsList); // Establecer los mentores filtrados inicialmente
      } catch (error) {
        console.error("Error al obtener los mentores:", error);
      }
    };

    fetchMentors();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCareerChange = (e) => {
    setSelectedCareer(e.target.value);
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
  };

  // Filtrar mentores
  const filteredMentorsList = mentors.filter((mentor) => {
    return (
      mentor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCareer ? mentor.carrera === selectedCareer : true) &&
      (selectedSpecialization ? mentor.especializaciones?.includes(selectedSpecialization) : true)
    );
  });

  const handleViewProfile = (mentorId) => {
    navigate(`/mentor/${mentorId}`); // Redirige al perfil del mentor
  };

  // Maneja la apertura del modal de solicitud
  const handleOpenModal = (mentorId) => {
    setSelectedMentorId(mentorId); // Guardamos el mentorId seleccionado
    setIsModalOpen(true);
  };

  // Maneja el cierre del modal de solicitud
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Maneja el envío del formulario en el modal
  const handleSendRequest = async (mentorId) => {
    if (!selectedMentorId) {
      console.error("No mentor selected");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "solicitudes"), {
        mensaje: message,
        estado: "pendiente",
        estudiante_uid: getAuth().currentUser.uid,
        tutor_uid: selectedMentorId,
        timestamp: serverTimestamp(),
      });

      console.log("Solicitud enviada con éxito: ", docRef.id);
      setIsModalOpen(false); // Cierra el modal después de enviar
    } catch (error) {
      console.error("Error al enviar la solicitud: ", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.navBar}>
        <img src={logo} alt="Logo Mentor" style={styles.logo} />
        <div style={styles.rightNav}>
          <FaBell style={styles.bellIcon} onClick={() => setIsNotificationModalOpen(true)} />
          <FaUser style={styles.userIcon} onClick={() => navigate("/profileScreen")} />
          <BottomNavLogout />
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar Mentores"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <div>
            <label style={styles.filterLabel}>Carrera: </label>
            <select value={selectedCareer} onChange={handleCareerChange} style={styles.selectInput}>
              <option value="">Selecciona una carrera</option>
              <option value="Ingeniería en Sistemas Informáticos">Ingeniería en Sistemas Informáticos</option>
              <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
              <option value="Ingeniería de Telecomunicaciones">Ingeniería de Telecomunicaciones</option>
              <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
            </select>
          </div>

          <div>
            <label style={styles.filterLabel}>Especialización: </label>
            <select value={selectedSpecialization} onChange={handleSpecializationChange} style={styles.selectInput}>
              <option value="">Selecciona una especialización</option>
              <option value="Ingeniería de Software">Ingeniería de Software</option>
              <option value="Redes y Comunicaciones">Redes y Comunicaciones</option>
              <option value="Inteligencia Artificial">Inteligencia Artificial</option>
              <option value="Seguridad Informática">Seguridad Informática</option>
            </select>
          </div>
        </div>

        <div style={styles.resultContainer}>
          {filteredMentorsList.map((mentor, index) => (
            <div key={index} style={styles.mentorCard}>
              <img src={personImage} alt={mentor.nombre} style={styles.mentorImage} />
              <div style={styles.mentorInfo}>
                <h3 style={styles.mentorName}>{mentor.nombre}</h3>
                <p style={styles.mentorSpecialization}>{mentor.especializaciones.join(', ')}</p>
              </div>
              <button style={styles.requestButton} onClick={() => handleOpenModal(mentor.id)}>
                Enviar Solicitud
              </button>
            </div>
          ))}
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
              <div style={styles.notificationItem}>
                <p>¡Tienes una nueva solicitud!</p>
              </div>
            </div>
            <button onClick={() => setIsNotificationModalOpen(false)} style={styles.modalButton2}>
              Cerrar
            </button>
          </div>
        </div>
      )}

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
    backgroundColor: "#333",
    color: "#fff",
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
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: "30px",
    padding: "5px 15px",
    marginBottom: "30px",
    justifyContent: "space-between",
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
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.5)",
  },
  notificationContent: {
    marginBottom: "15px",
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
