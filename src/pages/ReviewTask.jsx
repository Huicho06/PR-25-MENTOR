import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const ReviewTask = () => {
  const { tareaId } = useParams();
  const navigate = useNavigate();

  const [entrega, setEntrega] = useState(null);
  const [comentario, setComentario] = useState("");
  const [anotaciones, setAnotaciones] = useState([""]);

  useEffect(() => {
    const fetchEntrega = async () => {
      try {
        const q = query(
          collection(db, "Entregas"),
          where("tareaId", "==", tareaId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const entregaDoc = snapshot.docs[0];
          const data = entregaDoc.data();
          setEntrega({ id: entregaDoc.id, ...data });
          setComentario(data.comentarioDocente || "");
          setAnotaciones(data.anotaciones || [""]);
        } else {
          console.warn("No se encontró entrega para esta tarea");
        }
      } catch (error) {
        console.error("Error al cargar la entrega:", error);
      }
    };

    fetchEntrega();
  }, [tareaId]);

const handleSave = async () => {
  try {
    await updateDoc(doc(db, "Entregas", entrega.id), {
      comentarioDocente: comentario,
      anotaciones: anotaciones.filter(a => a.trim() !== ""),
      estado: "revisada", // ✔ Cambia el estado
      fechaRevision: new Date() // ✔ Registra la fecha
    });
    alert("Revisión guardada");
    navigate(-1);
  } catch (error) {
    console.error("Error al guardar revisión:", error);
    alert("Error al guardar revisión");
  }
};


  const handleChangeAnotacion = (index, value) => {
    const nuevas = [...anotaciones];
    nuevas[index] = value;
    setAnotaciones(nuevas);
  };

  const handleAddAnotacion = () => {
    setAnotaciones([...anotaciones, ""]);
  };

  const handleRemoveAnotacion = (index) => {
    const nuevas = anotaciones.filter((_, i) => i !== index);
    setAnotaciones(nuevas);
  };

  if (!entrega) return <p style={{ color: "#fff" }}>Cargando entrega...</p>;

  return (
    <div style={styles.wrapper}>
      <h2>Revisión de Entrega</h2>

      <label style={styles.label}>Comentario general:</label>
      <textarea
        style={styles.textarea}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Comentario global del trabajo"
      />

      <label style={styles.label}>Anotaciones específicas:</label>
      {anotaciones.map((a, i) => (
        <div key={i} style={styles.anotacionRow}>
          <input
            type="text"
            value={a}
            onChange={(e) => handleChangeAnotacion(i, e.target.value)}
            style={styles.input}
            placeholder={`Anotación ${i + 1}`}
          />
          <button onClick={() => handleRemoveAnotacion(i)} style={styles.removeBtn}>✕</button>
        </div>
      ))}
      <button onClick={handleAddAnotacion} style={styles.addBtn}>+ Añadir anotación</button>

      <div style={styles.actions}>
        <button onClick={handleSave} style={styles.saveBtn}>Guardar</button>
        <button onClick={() => navigate(-1)} style={styles.cancelBtn}>Cancelar</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
    color: "#fff",
    maxWidth: "600px",
    margin: "0 auto",
  },
  label: {
    display: "block",
    marginTop: "10px",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#1ed760"
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "6px",
    color: "#fff",
  },
  anotacionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  addBtn: {
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "10px"
  },
  removeBtn: {
    backgroundColor: "#e53935",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px"
  },
  saveBtn: {
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  cancelBtn: {
    backgroundColor: "#888",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default ReviewTask;
