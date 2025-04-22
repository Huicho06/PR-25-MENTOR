import React, { useState } from "react";

import { FaHome, FaComments, FaUser } from "react-icons/fa"; // Para los iconos
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda

import { useNavigate } from "react-router-dom"; // Para la navegación

const Navbar = () => {

  const [activeTab, setActiveTab] = useState("chat"); // Estado para manejar qué botón está activo
  const [searchTerm, setSearchTerm] = useState(""); // Para la barra de búsqueda

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para cambiar el estado del botón activo
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  
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
          placeholder="Search"
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
