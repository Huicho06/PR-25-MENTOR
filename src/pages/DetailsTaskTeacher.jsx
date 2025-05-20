import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { doc, getDoc,deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const DetailsTaskTeacher = () => {
  const navigate = useNavigate();
  const { taskId } = useParams(); // Obtener id de la ruta
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!taskId) return;

  const fetchTask = async () => {
    try {
      const taskRef = doc(db, "tareas", taskId);
      const taskSnap = await getDoc(taskRef);

      if (taskSnap.exists()) {
        // Agregar el id explícitamente al objeto
        setTask({ id: taskSnap.id, ...taskSnap.data() });
      } else {
        alert("La tarea no existe");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error cargando la tarea:", error);
      alert("Error al cargar la tarea");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  fetchTask();
}, [taskId, navigate]);


const handleDelete = async () => {
  if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
    try {
      const taskRef = doc(db, "tareas", taskId);  // taskId lo obtienes igual que en useEffect
      await deleteDoc(taskRef);
      alert("Tarea eliminada correctamente");
      navigate("/TaskScreenTeacher");
    } catch (error) {
      console.error("Error eliminando la tarea:", error);
      alert("No se pudo eliminar la tarea");
    }
  }
};
  if (loading) return <p>Cargando tarea...</p>;

  if (!task) return null;

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <div style={styles.container}>
        <h2 style={styles.title}>Detalles de la Tarea</h2>
        <p><strong>Título:</strong> {task.titulo}</p>
        <p><strong>Grupo asignado:</strong> {task.grupo || task.group}</p>
        <p><strong>Fecha de entrega:</strong> {task.fechaEntrega?.toDate?.().toLocaleString()}</p>
        <p><strong>Descripción:</strong> {task.descripcion || "Sin descripción"}</p>

        <div style={styles.buttonContainer}>
          <button style={styles.editButton} onClick={() =>navigate(`/update-task-teacher/${task.id}`, { state: task })
}
>
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
