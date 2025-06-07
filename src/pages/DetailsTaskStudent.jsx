import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc, collection, query, where, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import { FaArrowLeft, FaPaperclip } from "react-icons/fa";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

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

      if (entrega) {
        const entregaRef = doc(db, "Entregas", entrega.id);
        await updateDoc(entregaRef, {
          archivoNombre: name,
          archivoUrl: url,
        });
        setEntrega(prev => ({ ...prev, archivoNombre: name, archivoUrl: url }));
      } else {
const docRef = await addDoc(collection(db, "Entregas"), {
  tareaId: taskId,
  estudianteUid: user.uid,
  archivoNombre: name,
  archivoUrl: url,
  estado: "entregado",  // <-- NO marcar como entregado aún
  fechaEntregaReal: null,
  fechaRevision: null,
});

setEntrega({
  id: docRef.id,
  tareaId: taskId,
  estudianteUid: user.uid,
  archivoNombre: name,
  archivoUrl: url,
  estado: "entregado",
  fechaEntregaReal: new Date(),
  fechaRevision: null,
});

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

  if (!task) return <p style={{ color: "#fff", textAlign: "center" }}>Cargando tarea...</p>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            <FaArrowLeft /> Volver
          </button>

{entrega?.estado !== "revisada" && (
  <button
    style={{
      ...styles.deliverButton,
      backgroundColor: entrega?.estado === "entregado" ? "#e53935" : "#1ed760"
    }}
    onClick={handleDeliverToggle}
    disabled={loading}
  >
    {entrega?.estado === "entregado" ? "Cancelar entrega" : "Entregar tarea"}
  </button>
)}


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
{(() => {
  const url = entrega.archivoUrl;
  const nombre = entrega.archivoNombre?.toLowerCase() || "";

  // Detecta si es archivo de Word
  const isWord = nombre.endsWith(".doc") || nombre.endsWith(".docx");

  const viewerUrl = isWord
    ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`
    : url;

  return (
    <a
      href={viewerUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "#1ed760",
        display: "inline-block",
        marginBottom: "10px",
        textDecoration: "underline"
      }}
    >
      {entrega.archivoNombre}
    </a>
  );
})()}

              {entrega.estado === "entregado" && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#ccc", fontSize: "0.9rem" }}>
                    Entregado el {entrega.fechaEntregaReal ? new Date(entrega.fechaEntregaReal).toLocaleString() : "fecha desconocida"}
                  </span>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "#ccc", fontStyle: "italic" }}>No has adjuntado ningún archivo.</p>
          )}
{entrega?.estado !== "revisada" && (

          <button
            style={{
              ...styles.attachButton,
              opacity: entrega && entrega.estado === "entregado" ? 0.6 : 1,
              cursor: entrega && entrega.estado === "entregado" ? "not-allowed" : "pointer"
            }}
            onClick={() => fileInputRef.current.click()}
disabled={entrega && (entrega.estado === "entregado" || entrega.estado === "revisada")}
          >
            <FaPaperclip style={{ marginRight: "8px" }} /> Adjuntar archivo
          </button>
)}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
{entrega?.estado === "revisada" && (
  <div style={{ marginTop: "10px", marginBottom: "20px" }}>
    <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
      {entrega.fechaRevision?.seconds
        ? `Revisado el ${new Date(entrega.fechaRevision.seconds * 1000).toLocaleString()}`
        : "Revisión completada (fecha no disponible)"}
    </p>

    <p style={{ marginTop: "10px" }}><strong>Comentario del docente</strong></p>
    <p style={{ color: "#ccc" }}>{entrega.comentarioDocente || "Sin comentarios"}</p>

    <p style={{ marginTop: "15px" }}><strong>Anotaciones:</strong></p>
    <ul style={{ paddingLeft: "20px", color: "#bbb" }}>
      {entrega.anotaciones?.length > 0 ? (
        entrega.anotaciones.map((nota, idx) => <li key={idx}>{nota}</li>)
      ) : (
        <li>Sin anotaciones</li>
      )}
    </ul>
  </div>
)}

      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    padding: "60px 80px 120px",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container: {
    width: "100%",
    maxWidth: "1400px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "40px 60px",
    boxShadow: "0 0 12px rgba(0,0,0,0.4)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  backButton: {
    backgroundColor: "transparent",
    color: "#1ed760",
    border: "1px solid #1ed760",
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderRadius: "6px",
    padding: "6px 14px"
  },
  deliverButton: {
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "5px",
    textAlign: "center",
  },
  dueDate: {
    color: "#ccc",
    marginBottom: "25px",
    textAlign: "center"
  },
  section: {
    marginBottom: "40px",
  },
  attachButton: {
    backgroundColor: "#1ed760",
    border: "none",
    padding: "10px 20px",
    color: "#000",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
};

export default DetailsTaskStudent;
