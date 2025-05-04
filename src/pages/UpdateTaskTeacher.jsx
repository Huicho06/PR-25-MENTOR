import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

const UpdateTaskTeacher = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [title, setTitle] = useState(state?.title || "");
  const [group, setGroup] = useState(state?.group || "Grupo C");
  const [dueDate, setDueDate] = useState(state?.dueDate || "");

  const handleUpdate = () => {
    // Aquí actualizas en Firebase o tu estado global
    alert("Tarea actualizada");
    navigate("/tasks-teacher");
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Editar Tarea</h2>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select value={group} style={styles.input} onChange={(e) => setGroup(e.target.value)}>
          <option value="Grupo C">Grupo C</option>
          <option value="Grupo B">Grupo B</option>
          <option value="Grupo A">Grupo A</option>
        </select>
        <input
          style={styles.input}
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button style={styles.button} onClick={handleUpdate}>Guardar Cambios</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    padding: "20px",
    color: "#fff",
  },
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
  },
  title: {
    color: "#1ed760",
    fontSize: "1.5rem",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "1rem",
    marginBottom: "10px",
    width: "100%",
  },
  button: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default UpdateTaskTeacher;
