import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

const DetailsTaskTeacher = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { title, dueDate, group } = state || {};

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      // Aquí puedes agregar lógica para eliminar la tarea en Firebase o estado global
      alert("Tarea eliminada");
      navigate("/TaskScreenTeacher");
    }
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Detalles de la Tarea</h2>
        <p><strong>Título:</strong> {title}</p>
        <p><strong>Grupo asignado:</strong> {group}</p>
        <p><strong>Fecha de entrega:</strong> {dueDate}</p>

        <div style={styles.buttonContainer}>
          <button style={styles.editButton} onClick={() => navigate("/UpdateTaskTeacher", { state })}>
            Editar Tarea
          </button>
          <button style={styles.deleteButton} onClick={handleDelete}>
            Eliminar Tarea
          </button>
        </div>
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
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    gap: "10px",
  },
  editButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default DetailsTaskTeacher;
