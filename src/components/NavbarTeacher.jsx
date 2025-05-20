import React from "react";
import { useNavigate } from "react-router-dom"; // Para la navegación
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda

const Navbar = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const [activeTab, setActiveTab] = React.useState("chat");
  // Función para cambiar el estado del botón activo y navegar
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "chat") {
      navigate("/ChatScreenTeacher"); // Redirige a la pantalla de chat
    } else if (tab === "tasks") {
      navigate("/TaskScreenTeacher"); // Redirige a la pantalla de tareas
    }
  };

  // Usar useEffect para actualizar el estado cuando la ruta cambie
    React.useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("TaskScreenTeacher")) {
      setActiveTab("tasks");
    } else if (path.includes("ChatScreenTeacher")) {
      setActiveTab("chat");
    }
  }, [window.location.pathname]);

  return (
    <div>
      {/* Barra superior con título y botones */}

      {/* Botones de "Chat" y "Tareas" */}
      <div style={styles.chatTasksBtns}>
        <button
          style={activeTab === "chat" ? styles.chatBtnActive : styles.chatBtn}
          onClick={() => handleTabChange("chat")}
        >
          Chat
        </button>
        <button
          style={activeTab === "tasks" ? styles.tasksBtnActive : styles.tasksBtn}
          onClick={() => handleTabChange("tasks")}
        >
          Tareas
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #333",
  },
  backButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatTasksBtns: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  chatBtn: {
    backgroundColor: "#333", // Fondo gris para Chat
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
  },
  chatBtnActive: {
    backgroundColor: "#1ed760", // Verde para Chat activo
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
  },
  tasksBtn: {
    backgroundColor: "#333", // Fondo gris para Tareas
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tasksBtnActive: {
    backgroundColor: "#1ed760", // Verde para Tareas activo
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "90%",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    textAlign: "center",
  },
};

export default Navbar;
