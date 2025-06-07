import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const UpdateTaskTeacher = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const taskId = state?.id; // Asegúrate que envíes el id en el state al navegar

  // Transformar fecha Firestore a formato ISO para input datetime-local
  const fechaLocal = state?.fechaEntrega
    ? new Date(state.fechaEntrega.seconds * 1000).toISOString().slice(0, 16)
    : "";

  const [title, setTitle] = useState(state?.titulo || "");
  const [group, setGroup] = useState(state?.grupo || "");
  const [dueDate, setDueDate] = useState(fechaLocal);

  const handleUpdate = async () => {
    if (!taskId) {
      console.error("No se encontró el ID de la tarea.",error);
      return;
    }

    try {
      const taskRef = doc(db, "tareas", taskId);

      // Convertir dueDate a Timestamp si es necesario (aquí asumo que guardas como Date en Firestore)
      const fechaEntregaDate = new Date(dueDate);

      await updateDoc(taskRef, {
        titulo: title,
        grupo: group,
        fechaEntrega: fechaEntregaDate,
      });

      navigate(`/TaskScreenTeacher`);
    } catch (error) {
      console.error("Error actualizando la tarea:", error);
      console.error("Error al actualizar la tarea.",error);
    }
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
        <select
          value={group}
          style={styles.input}
          onChange={(e) => setGroup(e.target.value)}
        >
          {/* Agrega dinámicamente el grupo actual si no está en las opciones fijas */}
          {group && !["Grupo C", "Grupo B", "Grupo A"].includes(group) && (
            <option value={group}>{group}</option>
          )}

        </select>

        <input
          style={styles.input}
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button style={styles.button} onClick={handleUpdate}>
          Guardar Cambios
        </button>
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
