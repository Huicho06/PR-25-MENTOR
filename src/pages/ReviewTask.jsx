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
        estado: "revisada",
        fechaRevision: new Date()
      });
      navigate(-1);
    } catch (error) {
      console.error("Error al guardar revisión:", error);
      alert("❌ Error al guardar revisión");
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

  if (!entrega) return <p style={{ color: "#fff", textAlign: "center" }}>Cargando entrega...</p>;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Revisión de Entrega</h2>

      <div style={styles.section}>
        <label style={styles.label}>Comentario general:</label>
        <textarea
          style={styles.textarea}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Comentario global del trabajo"
        />
      </div>

      <div style={styles.section}>
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
      </div>

      <div style={styles.actions}>
        <button onClick={handleSave} style={styles.saveBtn}>Guardar</button>
        <button onClick={() => navigate(-1)} style={styles.cancelBtn}>↩ Cancelar</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#121212",
    padding: "30px",
    borderRadius: "12px",
    color: "#fff",
    maxWidth: "700px",
    margin: "50px auto",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    color: "#1ed760",
    marginBottom: "30px"
  },
  section: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "bold",
    color: "#ccc",
    fontSize: "1rem"
  },
  textarea: {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    fontSize: "1rem"
  },
  input: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#1e1e1e",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "1rem"
  },
  anotacionRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px"
  },
  addBtn: {
    backgroundColor: "#292929",
    color: "#1ed760",
    border: "1px solid #1ed760",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },
  removeBtn: {
    backgroundColor: "#ff5252",
    border: "none",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "30px"
  },
  saveBtn: {
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "0.3s"
  },
  cancelBtn: {
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer"
  }
};

export default ReviewTask;
