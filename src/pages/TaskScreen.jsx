import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda
import { FiMessageCircle } from "react-icons/fi"; // Icono de mensaje
import BottomNav from "../components/BottomNav"; // Para la barra de navegación
import Navbar from "../components/Navbar"; // Para la barra de navegación
import MainNavbar from "../components/MainNavbar"; // Para la barra de navegación

const TaskScreen = () => {
  const [tasks, setTasks] = useState([
    { title: "Rombos", dueDate: "2 mayo 23:59", course: "PROCESAMIENTO DIGITAL DE IMAGENES", group: "Grupo C" },
    { title: "Actividad Autoaprendizaje 2", dueDate: "12 mayo 23:59", course: "PROYECTO DE SISTEMAS II", group: "Grupo C" },
    { title: "Actividad de Autoaprendizaje Asíncrona: Design Thinking", dueDate: "14 mayo 13:55", course: "METODOLOGIA DE LA INVESTIGACION", group: "Grupo C" },
    { title: "Herramientas de Exploración", dueDate: "19 mayo 23:59", course: "DATA WAREHOUSING", group: "Grupo C" },
  ]);

  const [searchTerm, setSearchTerm] = useState(""); // Para la barra de búsqueda

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <Navbar />
      {/* Listado de tareas */}
      <div style={styles.taskList}>
        {tasks
          .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase())) // Filtra por búsqueda
          .map((task, index) => (
            <div key={index} style={styles.taskItem}>
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDetails}>
                  {task.course} - {task.group}
                </p>
                <p style={styles.dueDate}>Vence el {task.dueDate}</p>
              </div>
            </div>
          ))}
      </div>

      {/* BottomNav */}
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
    padding: "20px",
  },
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
  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1ed760", // Usando el verde de tu paleta
  },
  searchButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  taskList: {
    marginTop: "20px",
    overflowY: "auto",
    height: "calc(100vh - 150px)", // Ajustar la altura del scroll
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    backgroundColor: "#1a1a1a", // Color de fondo oscuro
    marginBottom: "10px",
    borderRadius: "10px",
    color: "#fff",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
  },
  taskDetails: {
    fontSize: "1rem",
    color: "#ccc",
    marginTop: "5px",
  },
  dueDate: {
    fontSize: "0.9rem",
    color: "#bbb",
    marginTop: "5px",
  },
};

export default TaskScreen;
