import React, { useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import BottomNavT from "../components/BottomNavTeacher";
import NavbarT from "../components/NavbarTeacher";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";
import BottomNavTeacher from "../components/BottomNavTeacher";


const TaskScreenTeacher = () => {
  const [tasks, setTasks] = useState([
    {
      title: "Rombos",
      dueDate: "2 mayo 23:59",
      group: "Grupo C",
    },
    {
      title: "Actividad Autoaprendizaje 2",
      dueDate: "12 mayo 23:59",
      group: "Grupo C",
    },
    {
      title: "Actividad de Autoaprendizaje Asíncrona: Design Thinking",
      dueDate: "14 mayo 13:55",
      group: "Grupo C",
    },
    {
      title: "Herramientas de Exploración",
      dueDate: "19 mayo 23:59",
      group: "Grupo C",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const navigate = useNavigate();
  const handleAddTask = () => {
    navigate("/create-task-teacher");
  };
  
  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <NavbarT />

      {/* Lista de tareas */}
      <div style={styles.taskList}>
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task, index) => (
            <div
              key={index}
              style={{ ...styles.taskItem, cursor: "pointer" }}
              onClick={() => navigate("/DetailsTaskTeacher", { state: task })}
            >
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskDetails}>
                  <strong>Asignado a:</strong> {task.group}
                </p>
                <p style={styles.dueDate}>🕒 Vence el {task.dueDate}</p>
              </div>
            </div>
          ))
          }
      </div>

      {/* Botón flotante para agregar tarea */}
      <button onClick={handleAddTask} style={styles.fabButton}>
        <FaPlus size={18} />
      </button>

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
    padding: "20px",
    position: "relative",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "8px 12px",
    marginBottom: "10px",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
  },
  searchIcon: {
    color: "#ccc",
    marginLeft: "10px",
  },
  taskList: {
    flex: 1,
    overflowY: "auto",
    height: "calc(100vh - 180px)",
  },
  taskItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
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
    fontSize: "0.95rem",
    color: "#ccc",
    marginTop: "5px",
  },
  dueDate: {
    fontSize: "0.9rem",
    color: "#bbb",
    marginTop: "5px",
  },
  fabButton: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    color: "#fff",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
    cursor: "pointer",
    zIndex: 999,
  },
};

export default TaskScreenTeacher;
