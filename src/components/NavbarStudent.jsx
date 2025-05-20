import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const NavbarStudent =  ({ searchTerm, setSearchTerm }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "chat") {
      navigate("/ChatScreen"); // Rutas para estudiantes
    } else if (tab === "tasks") {
      navigate("/TaskScreen"); 
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("TaskScreen")) {
      setActiveTab("tasks");
    } else if (path.includes("ChatScreen")) {
      setActiveTab("chat");
    }
  }, [window.location.pathname]);

  return (
    <div>
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
  chatTasksBtns: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  chatBtn: {
    backgroundColor: "#333",
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
    backgroundColor: "#1ed760",
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
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tasksBtnActive: {
    backgroundColor: "#1ed760",
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

export default NavbarStudent;
