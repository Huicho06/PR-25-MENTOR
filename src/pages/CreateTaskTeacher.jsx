import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import Navbar from "../components/Navbar";

const CreateTaskTeacher = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("Grupo C");
  const [dueDate, setDueDate] = useState("");

  const handleSave = () => {
    // Aquí puedes guardar a Firebase o a un estado global
    console.log({ title, group, dueDate });
    alert("Tarea guardada");
    navigate("/tasks-teacher");
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Agregar Nueva Tarea</h2>
        <input
          style={styles.input}
          placeholder="Título de la tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select style={styles.input} value={group} onChange={(e) => setGroup(e.target.value)}>
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
        <button style={styles.button} onClick={handleSave}>Guardar Tarea</button>
      </div>
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
      container: {
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        maxWidth: "400px", // ancho máximo
        margin: "0 auto",  // centrar horizontalmente
        width: "100%",     // que no se pase del 100% en pantallas pequeñas
      },
      
  title: {
    color: "#1ed760",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1ed760",
    color: "white",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
  },
};

export default CreateTaskTeacher;
