import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase"; // Firebase Firestore
import { getAuth } from "firebase/auth"; // Importar Firebase Auth
import { getDocs, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore"; // Métodos para obtener datos y agregar nuevos
import logo from "../assets/logo.png"; // Logo de la app
import MainNavbar from "../components/MainNavbar"; // Importa el componente BottomNav
import personImage from "../assets/person.png"; // Imagen de perfil predeterminada
import { FaBell, FaUser } from "react-icons/fa"; // Iconos de campanita y usuario
import { FiFilter } from "react-icons/fi"; // Icono de filtro
import BottomNav from "../components/BottomNav"; // Componente de navegación inferior
import { getDoc,doc,updateDoc } from "firebase/firestore"; // Importar doc


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
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(""); // Estado para el nombre del proyecto
  const [selectedStudents, setSelectedStudents] = useState([]); // Estado para los estudiantes seleccionados
  const [selectedStudentsIds, setSelectedStudentsIds] = useState([]);
  const [showMemberResults, setShowMemberResults] = useState(false);
  const [students, setStudents] = useState([]);
  const [project, setProject] = useState(null); 

  const currentUser = getAuth().currentUser;
  console.log(currentUser);
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
  useEffect(() => {
    // Obtener estudiantes al abrir el modal de agregar proyecto
    const fetchStudents = async () => {
      try {
        const studentsQuery = query(
          collection(db, "usuarios"),
          where("tipo", "==", "student")
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        const studentsList = studentsSnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((student) => student.id !== getAuth().currentUser.uid); // Excluir al logueado
        setStudents(studentsList);
      } catch (error) {
        console.error("Error al obtener los estudiantes:", error);
      }
    };
    
    //fetchMentors();
    fetchStudents();
  }, [currentUser]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCareerChange = (e) => {
    setSelectedCareer(e.target.value);
  };

  const handleSpecializationChange = (e) => {
    setSelectedSpecialization(e.target.value);
  };
  // Para seleccionar estudiantes en el proyecto
// Manejar la selección de estudiantes para el proyecto
const handleSelectStudent = (student) => {
  if (selectedStudentsIds.includes(student.id)) {
    // Si ya está seleccionado, lo desmarcamos
    setSelectedStudents(selectedStudents.filter(id => id !== student.displayName)); // Eliminar nombre
    setSelectedStudentsIds(selectedStudentsIds.filter(id => id !== student.id)); // Eliminar ID
  } else {
    // Si no está seleccionado, lo agregamos
    setSelectedStudents([...selectedStudents, student.nombre]); // Añadir nombre
    setSelectedStudentsIds([...selectedStudentsIds, student.id]); // Añadir ID
  }
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
    // Verificamos si el estudiante ya tiene un proyecto asignado
    const fetchProject = async () => {
      try {
        const userRef = doc(db, "usuarios", getAuth().currentUser.uid); // Correcta referencia al documento del usuario
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        if (userData.proyecto) {
          setProject(userData.proyecto); // Si tiene proyecto, lo seteamos
          setIsModalOpen(true); // Abrimos el modal de solicitud
        } else {
          // Si no tiene proyecto, mostramos el modal para agregar proyecto
          setIsProjectModalOpen(true);
        }
      } catch (error) {
        console.error("Error al obtener el proyecto:", error);
      }
    };
    

    fetchProject();
  };


  // Maneja el cierre del modal de solicitud
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };
 // Enviar la solicitud
 const handleSendRequest = async () => {
  if (!project || !project.name || !project.members || project.members.length === 0) {
    console.error("El proyecto o los miembros no están definidos correctamente.");
    return; // Detenemos el envío si no hay proyecto válido
  }
  try {
    const docRef = await addDoc(collection(db, "solicitudes"), {
      mensaje: message,
      estado: "pendiente",
      estudiante_uid: getAuth().currentUser.uid,
      tutor_uid: selectedMentorId,
      proyecto_nombre: project.name,
      proyecto_integrantes: project.members,
      proyecto_integrantes_ids: project.members_ids,
      timestamp: serverTimestamp(),
    });

    console.log("Solicitud enviada con éxito: ", docRef.id);
    setIsModalOpen(false); // Cerrar el modal después de enviar
  } catch (error) {
    console.error("Error al enviar la solicitud: ", error);
  }
};
 // Agregar el proyecto
 const handleAddProject = async () => {
  if (!projectName || selectedStudentsIds.length === 0) {
    console.error("Por favor, complete todos los campos.");
    return;
  }
  
  const allMembers = [
    getAuth().currentUser.displayName,  // Nombre del estudiante logueado
    ...selectedStudents.map(studentId => {
      const student = students.find(s => s.id === studentId);
      return student ? student.nombre : null; // Aquí obtienes el nombre correctamente
    }).filter(name => name)  // Filtramos los null
  ];
  console.log(getAuth().currentUser.displayName);
  const allMemberIds = [
    getAuth().currentUser.uid,  // ID del estudiante logueado
    ...selectedStudentsIds,  // IDs de los estudiantes seleccionados
  ];
  try {
    //const membersWithLoggedInStudent = [...selectedStudents, getAuth().currentUser.uid]; 

    const projectData = {
      name: projectName,
      members: allMembers,
      members_ids: allMemberIds,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "proyectos"), projectData);
    console.log("Proyecto agregado con éxito: ", docRef.id);

    // Actualizamos el proyecto del estudiante logueado
    const studentRef = doc(db, "usuarios", getAuth().currentUser.uid);
    await updateDoc(studentRef, { proyecto: docRef.id });

    // Actualizamos el proyecto de los estudiantes seleccionados
    for (const studentId of selectedStudentsIds) {
      const studentRef = doc(db, "usuarios", studentId);
      await updateDoc(studentRef, { proyecto: docRef.id });
    }

    setIsProjectModalOpen(false); // Cerrar el modal de proyecto
  } catch (error) {
    console.error("Error al agregar el proyecto: ", error);
  }
};
 // Seleccionar estudiantes para el proyecto
 

  return (
    <div style={styles.wrapper}>

<MainNavbar />

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
{/* Botón flotante para ver o agregar proyecto */}
<button onClick={() => setIsProjectModalOpen(true)} style={styles.projectFabButton}>
  📁
</button>

{/* Modal para agregar proyecto */}
{isProjectModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Agregar Proyecto</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)} // Actualiza el nombre del proyecto
              placeholder="Nombre del proyecto"
              style={styles.modalInput}
            />

            {/* Mostrar estudiantes disponibles */}
            {/* Mostrar estudiantes disponibles */}
<div style={{ ...styles.modalInput, padding: 0, border: "none" }}>
  <label style={{ marginBottom: "5px", display: "block", fontWeight: "bold" }}>
    Integrantes del Proyecto:
  </label>
  {students.map((student, index) => (
    <label key={index} style={{ display: "block", marginBottom: "10px" }}>
      <input
        type="checkbox"
        onChange={() => handleSelectStudent(student)} // Usamos el handleSelectStudent
        checked={selectedStudentsIds.includes(student.id)} // Marcamos si ya está seleccionado
      />
      {student.nombre}
    </label>
  ))}
</div>


            <button style={styles.modalButton1} onClick={handleAddProject}>
              Agregar Proyecto
            </button>
            <button style={styles.modalButton2} onClick={handleCloseProjectModal}>
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
    marginBottom: "20px",
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
    marginRight: "10px",
  },
  modalButton2: {
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
  },
  projectFabButton: {
    position: "fixed",
    bottom: "100px",
    right: "20px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
    zIndex: 999,
  },
  modalInput: {
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#333",
    color: "#fff",
    width: "100%",
  }
  
};

export default MainScreen;
