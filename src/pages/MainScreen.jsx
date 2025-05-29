import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase"; // Firebase Firestore
import { getAuth } from "firebase/auth"; // Importar Firebase Auth
import { getDocs, collection, query, where, addDoc, serverTimestamp } from "firebase/firestore"; // Métodos para obtener datos y agregar nuevos
import logo from "../assets/logo.png"; // Logo de la app
import Navbar from "../components/Navbar";
 // Importa el componente BottomNav
import personImage from "../assets/person.png"; // Imagen de perfil predeterminada
import { FaBell, FaUser } from "react-icons/fa"; // Iconos de campanita y usuario
import { FiFilter } from "react-icons/fi"; // Icono de filtro
import BottomNav from "../components/BottomNav"; // Componente de navegación inferior
import { getDoc,doc,updateDoc } from "firebase/firestore"; // Importar doc
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // ajusta la ruta según dónde lo creaste


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
  const [studentSearch, setStudentSearch] = useState("");
  //const currentUser = getAuth().currentUser;
  const [projectSummaryOnly, setProjectSummaryOnly] = useState(false); 
  const [showProjectWarning, setShowProjectWarning] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [duplicateRequestWarning, setDuplicateRequestWarning] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
const [showRechazoModal, setShowRechazoModal] = useState(false);
const [rechazoDetalle, setRechazoDetalle] = useState(null);
const [currentUser, setCurrentUser] = useState(null);
const [currentUserName, setCurrentUserName] = useState("");

useEffect(() => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged(user => {
    setCurrentUser(user);
  });
  return unsubscribe;
}, []);
useEffect(() => {
  if (!currentUser) return;

  const fetchUserName = async () => {
    try {
      const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUserName(userDoc.data().nombre || "Nombre desconocido");
        console.log("Nombre usuario:", userDoc.data().nombre);
      } else {
        setCurrentUserName("Nombre desconocido");
      }
    } catch (error) {
      console.error("Error al obtener nombre del usuario:", error);
      setCurrentUserName("Nombre desconocido");
    }
  };

  fetchUserName();
}, [currentUser]);



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


  useEffect(() => {
  const fetchCurrentUserName = async () => {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    try {
      const userDoc = await getDoc(doc(db, "usuarios", currentUser.uid));
      if (userDoc.exists()) {
        setCurrentUserName(userDoc.data().nombre || "Nombre desconocido");
      } else {
        setCurrentUserName("Nombre desconocido");
      }
    } catch (error) {
      console.error("Error al obtener nombre del usuario:", error);
      setCurrentUserName("Nombre desconocido");
    }
  };

  fetchCurrentUserName();
}, []);

  useEffect(() => {
  const obtenerNotificaciones = async () => {
    const q = query(
      collection(db, "notificaciones"),
      where("uid", "==", currentUser?.uid),
      where("leido", "==", false)
    );
    const snapshot = await getDocs(q);
    const nuevas = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotificaciones(nuevas);
  };

  if (currentUser) obtenerNotificaciones();
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
    // Si ya está seleccionado, deseleccionarlo (vaciar la selección)
    setSelectedStudents([]);
    setSelectedStudentsIds([]);
  } else {
    // Solo agregar ese estudiante y reemplazar cualquier selección anterior
    setSelectedStudents([student.nombre]);
    setSelectedStudentsIds([student.id]);
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
    setSelectedMentorId(mentorId);
    setProjectSummaryOnly(false);
  
    const fetchProject = async () => {
      try {
        const userRef = doc(db, "usuarios", getAuth().currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
  
        if (!userData.proyecto) {
          setShowProjectWarning(true);
          setTimeout(() => setShowProjectWarning(false), 3000);
          return;
        }
  
        const projectRef = doc(db, "proyectos", userData.proyecto);
        const projectSnap = await getDoc(projectRef);
        const projectData = projectSnap.data();
        setProject(projectData);
        console.log("Proyecto cargado:", projectData);
        console.log("Integrantes:", projectData.members_ids);
        // Validar solicitudes pendientes
        const solicitudesSnapshot = await getDocs(
          query(collection(db, "solicitudes"), where("estado", "==", "pendiente"))
        );
  
        const solicitudes = solicitudesSnapshot.docs.map(doc => doc.data());
        console.log("Solicitudes pendientes:");
        solicitudes.forEach((s, i) => {
          console.log(`#${i + 1}`, s.proyecto_integrantes_ids);
        });
        const algunIntegranteTieneSolicitud = solicitudes.some(solicitud => {
          if (!Array.isArray(solicitud.proyecto_integrantes_ids)) return false;
          return solicitud.proyecto_integrantes_ids.some(id =>
            projectData.members_ids?.includes(id)
          );
        });
        
        if (algunIntegranteTieneSolicitud) {
          setDuplicateRequestWarning(true);
          setTimeout(() => setDuplicateRequestWarning(false), 3000);
          return;
        }
  
        // Abrir modal si todo está bien
        setIsModalOpen(true);
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
    // 1. Verificar si ya hay solicitud pendiente
    const solicitudesSnapshot = await getDocs(
      query(
        collection(db, "solicitudes"),
        where("estado", "in", ["pendiente", "aceptado"])
      )
    );

    const solicitudes = solicitudesSnapshot.docs.map(doc => doc.data());

    // 2. Revisar si alguno de los miembros ya está en una solicitud pendiente
    const alguienYaSolicitó = solicitudes.some(solicitud =>
      solicitud.proyecto_integrantes_ids?.some(id => project.members_ids.includes(id))
    );

    if (alguienYaSolicitó) {
      setDuplicateRequestWarning(true);
      setTimeout(() => setDuplicateRequestWarning(false), 3000);
      return;
    }
    let archivoURL = "";
    if (file) {
      archivoURL = await uploadToCloudinary(file);
    }

    await addDoc(collection(db, "solicitudes"), {
      mensaje: message,
      estado: "pendiente",
      estudiante_uid: getAuth().currentUser.uid,
      tutor_uid: selectedMentorId,
      proyecto_nombre: project.name,
      proyecto_integrantes: project.members,
      proyecto_integrantes_ids: project.members_ids,
      archivo_url: archivoURL,
      timestamp: serverTimestamp(),
    });
    setRequestSuccess(true); // mostrar éxito
    setTimeout(() => setRequestSuccess(false), 3000);

    setIsModalOpen(false); // cerrar modal
    setMessage(""); // limpiar mensaje
    setFile(null);  // limpiar archivo
  } catch (error) {
    console.error("Error al enviar la solicitud: ", error);
  }
};


 // Agregar el proyecto
 const handleAddProject = async () => {
  if (!projectName) {
    console.error("Por favor, ingrese el nombre del proyecto.");
    return;
  }
  
  if (selectedStudentsIds.length > 1) {
    console.error("Solo puedes seleccionar máximo un estudiante.");
    return;
  }
  const allMembers = [
    currentUserName || "Nombre desconocido",  // <-- usa aquí currentUserName
    ...selectedStudents // ya son nombres
  ];
 console.log("Nombre usado para proyecto:", currentUserName);

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
    const studentRef = doc(db, "usuarios", currentUser.uid);
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
 const handleProjectButtonClick = async () => {
  try {
    const userRef = doc(db, "usuarios", getAuth().currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();

    if (userData.proyecto) {
      const projectRef = doc(db, "proyectos", userData.proyecto);
      const projectSnap = await getDoc(projectRef);
      setProject(projectSnap.data());
      setProjectSummaryOnly(true); // Modo resumen
      setIsModalOpen(true);
       // Reutiliza el modal pero con resumen
    } else {
      setIsProjectModalOpen(true); // Abrir modal de creación
    }
  } catch (error) {
    console.error("Error al verificar proyecto:", error);
  }
};



  return (
    <div style={styles.wrapper}>

<Navbar />
{duplicateRequestWarning && (
  <div style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    zIndex: 1000
  }}>
    Ya existe una solicitud por parte de tu grupo.
  </div>
)}

{requestSuccess && (
  <div style={{
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "0.95rem",
    zIndex: 1000
  }}>
    ¡Solicitud enviada con éxito!
  </div>
)}



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
<img
  src={mentor.fotoPerfil ? mentor.fotoPerfil : personImage}
  alt={mentor.nombre}
  style={styles.mentorImage}
/>
              <div style={styles.mentorInfo}>
                <h3 style={styles.mentorName}>{mentor.nombre}</h3>
                <p style={styles.mentorSpecialization}>{mentor.especializaciones.join(', ')}</p>
              </div>
              <button
  style={{ ...styles.requestButton1 ,backgroundColor: "#2196f3" , }}
  onClick={() => handleViewProfile(mentor.id)}
>
  Ver Detalles
</button>

              <button style={styles.requestButton2} onClick={() => handleOpenModal(mentor.id)}>
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
      {projectSummaryOnly ? (
        <>
          <h2>Resumen de tu proyecto</h2>
          <p><strong>Nombre:</strong> {project?.name}</p>
          <p><strong>Integrantes:</strong></p>
          <ul>
            {project?.members?.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
          <button onClick={handleCloseModal} style={styles.modalButton2}>
            Cerrar
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
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
{showRechazoModal && rechazoDetalle && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h2>Proyecto Rechazado</h2>
      <p><strong>Proyecto:</strong> {rechazoDetalle.proyecto_nombre}</p>
      <p><strong>Motivo:</strong> {rechazoDetalle.motivo}</p>
      <button
        style={styles.modalButton1}
        onClick={async () => {
          await updateDoc(doc(db, "notificaciones", rechazoDetalle.id), { leido: true });
          setShowRechazoModal(false);
        }}
      >
        Aceptar
      </button>
    </div>
  </div>
)}


{/* Botón flotante para ver o agregar proyecto */}

{showProjectWarning && (
  <div style={{
    position: "fixed",
    bottom: "160px",
    right: "20px",
    backgroundColor: "#f44336",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    zIndex: 1000
  }}>
    Debes crear un proyecto antes de enviar una solicitud.
  </div>
)}
<button onClick={handleProjectButtonClick} style={styles.projectFabButton}>
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
            <label style={{ marginBottom: "8px", fontWeight: "bold" }}>Añadir otro integrante</label>

            <input
  type="text"
  placeholder="Buscar estudiante..."
  value={studentSearch}
  onChange={(e) => setStudentSearch(e.target.value)}
  style={styles.modalInput}
/>

{studentSearch.trim() !== "" && (
  <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #555", borderRadius: "8px", padding: "10px" }}>
    {students
      .filter((s) =>
        s.nombre.toLowerCase().includes(studentSearch.toLowerCase())
      )
      .map((student) => {
        const isSelected = selectedStudentsIds.includes(student.id);
        const hasProject = !!student.proyecto;

        const handleClick = () => {
          if (hasProject) return; // no permite selección

          // Reemplaza al anterior
          setSelectedStudents([student.nombre]);
          setSelectedStudentsIds([student.id]);
        };

        return (
          <div key={student.id}>
            <div
              onClick={() => handleSelectStudent(student)}
              style={{
                padding: "8px",
                marginBottom: "6px",
                backgroundColor: isSelected ? "#1ed760" : "#333",
                color: hasProject ? "#aaa" : "#fff",
                borderRadius: "5px",
                cursor: hasProject ? "not-allowed" : "pointer",
              }}
            >
              {student.nombre}
            </div>
            {hasProject && (
              <p style={{ color: "#f44336", marginTop: "4px", marginBottom: "10px", fontSize: "0.85rem" }}>
                Este estudiante ya forma parte de un proyecto.
              </p>
            )}
          </div>
        );
      })}
  </div>
)}



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
    requestButton1: {
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "1rem",
    marginRight: "20px"
  },
  requestButton2: {
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
