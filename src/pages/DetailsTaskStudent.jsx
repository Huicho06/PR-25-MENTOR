import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaArrowLeft, FaPaperclip } from "react-icons/fa";
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; // Ajusta la ruta si es necesario

const DetailsTaskStudent = () => {
  const navigate = useNavigate();
  const { taskId } = useParams(); 
  const auth = getAuth();
  const user = auth.currentUser;

  const [task, setTask] = useState(null);
  const [entrega, setEntrega] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !taskId) return;

    const fetchTask = async () => {
      try {
        const taskRef = doc(db, "tareas", taskId);
        const taskSnap = await getDoc(taskRef);
        if (taskSnap.exists()) setTask(taskSnap.data());
        else {
          alert("La tarea no existe");
          navigate(-1);
        }
      } catch (error) {
        console.error("Error cargando la tarea:", error);
      }
    };

    const fetchEntrega = async () => {
      try {
        const q = query(
          collection(db, "Entregas"),
          where("tareaId", "==", taskId),
          where("estudianteUid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setEntrega({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
        } else {
          setEntrega(null);
        }
      } catch (error) {
        console.error("Error cargando entrega:", error);
      }
    };

    fetchTask();
    fetchEntrega();
  }, [user, taskId, navigate]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { url, type, name } = await uploadToCloudinary(file);

      // Crear o actualizar entrega en Firestore
      if (entrega) {
        // Actualizar entrega existente
        const entregaRef = doc(db, "Entregas", entrega.id);
        await updateDoc(entregaRef, {
  archivoNombre: name,
  archivoUrl: url,
  // NO actualizar estado aquí
  // NO actualizar fechaEntregaReal aquí, sólo al entregar
});
setEntrega(prev => ({
  ...prev,
  archivoNombre: name,
  archivoUrl: url,
  // NO cambiar estado ni fechaEntregaReal aquí
}));

      } else {
        // Crear nueva entrega
        const docRef = await addDoc(collection(db, "Entregas"), {
          tareaId: taskId,
          estudianteUid: user.uid,
          archivoNombre: name,
          archivoUrl: url,
          estado: "pendiente",
          fechaEntregaReal: new Date(),
          fechaRevision: null,
        });
        setEntrega({ id: docRef.id, tareaId: taskId, estudianteUid: user.uid, archivoNombre: name, archivoUrl: url, estado: "pendiente", fechaEntregaReal: new Date(), fechaRevision: null });
      }
    } catch (error) {
      console.error("Error al subir archivo:", error);
    }
    setLoading(false);
  };

const handleDeliverToggle = async () => {
  if (!entrega) return alert("Debes adjuntar un archivo primero.");

  const entregaRef = doc(db, "Entregas", entrega.id);
  const nuevoEstado = entrega.estado === "entregado" ? "pendiente" : "entregado";

  try {
    await updateDoc(entregaRef, { 
      estado: nuevoEstado,
      fechaEntregaReal: nuevoEstado === "entregado" ? new Date() : null,
    });
    setEntrega(prev => ({ 
      ...prev, 
      estado: nuevoEstado,
      fechaEntregaReal: nuevoEstado === "entregado" ? new Date() : null,
    }));
  } catch (error) {
    console.error("Error al actualizar estado:", error);
  }
};


  if (!task) return <p>Cargando tarea...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>

        {/* Botón Entregar / Cancelar entrega en la esquina superior derecha */}
        <button
          style={{ ...styles.deliverButton, backgroundColor: entrega?.estado === "entregado" ? "#e53935" : "#1ed760" }}
          onClick={handleDeliverToggle}
          disabled={loading}
        >
          {entrega?.estado === "entregado" ? "Cancelar entrega" : "Entregar tarea"}
        </button>
      </div>

      <h2 style={styles.title}>{task.titulo}</h2>
      <p style={styles.dueDate}>Vence el {task.fechaEntrega?.toDate().toLocaleString()}</p>

      <div style={styles.section}>
        <p><strong>Descripción</strong></p>
        <p>{task.descripcion || "Sin descripción"}</p>
      </div>



<div style={styles.section}>
  <p><strong>Mi trabajo</strong></p>

  {entrega && entrega.archivoUrl ? (
    <>
      <a
        href={entrega.archivoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1ed760", display: "inline-block", marginBottom: "10px", textDecoration: "underline" }}
      >
        {entrega.archivoNombre}
      </a>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ color: "#ccc", fontSize: "0.9rem" }}>
Entregado el {
  entrega.fechaEntregaReal
    ? (typeof entrega.fechaEntregaReal.toDate === "function"
        ? entrega.fechaEntregaReal.toDate().toLocaleString()
        : new Date(entrega.fechaEntregaReal).toLocaleString())
    : "fecha desconocida"
}
        </span>
      </div>
    </>
  ) : (
    <p style={{ color: "#ccc", fontStyle: "italic" }}>No has adjuntado ningún archivo.</p>
  )}

<button
  style={{
    ...styles.attachButton,
    opacity: entrega && entrega.estado === "entregado" ? 0.6 : 1,
    cursor: entrega && entrega.estado === "entregado" ? "not-allowed" : "pointer",
  }}
  onClick={() => fileInputRef.current.click()}
  disabled={entrega && entrega.estado === "entregado"}
>

    <FaPaperclip style={{ marginRight: "8px" }} /> Adjuntar archivo
  </button>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: "none" }}
    accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  />
</div>

    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "20px",
    minHeight: "100vh",
    position: "relative"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#1ed760",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  deliverButton: {
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "5px",
    color: "#fff",
  },
  dueDate: {
    color: "#ccc",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "25px",
  },
  materialBox: {
    backgroundColor: "#1a1a1a",
    padding: "12px",
    borderRadius: "8px",
    color: "#fff",
    marginTop: "10px",
  },
  attachButton: {
    backgroundColor: "#1ed760",
    border: "none",
    padding: "10px 20px",
    color: "#fff",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
};

export default DetailsTaskStudent;
