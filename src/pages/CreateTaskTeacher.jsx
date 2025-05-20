import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";

const CreateTaskTeacher = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // nuevo estado descripción
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      try {
        const q = query(
          collection(db, "solicitudes"),
          where("tutor_uid", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const grupos = snapshot.docs.map((doc) => doc.data().proyecto_nombre);
        const gruposUnicos = [...new Set(grupos)];
        setGroups(gruposUnicos);
        setGroup(gruposUnicos[0] || "");
      } catch (error) {
        console.error("Error al cargar los grupos:", error);
      }
    };

    fetchGroups();
  }, [user]);

  const handleSave = async () => {
    if (!title.trim() || !dueDate || !group) {
      return;
    }

    if (!user) {
      return;
    }

    try {
      await addDoc(collection(db, "tareas"), {
        titulo: title.trim(),
        descripcion: description.trim(), // guardamos descripción
        grupo: group,
        fechaEntrega: new Date(dueDate),
        creadoPor: user.uid,
        fechaCreacion: serverTimestamp(),
        estado: "pendiente",
      });

      navigate("/TaskScreenTeacher");
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
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
        {/* textarea para descripción */}
        <textarea
          style={{ ...styles.input, height: "100px", resize: "vertical" }}
          placeholder="Descripción de la tarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          style={styles.input}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {groups.length > 0 ? (
            groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))
          ) : (
            <option value="">No tienes grupos asignados</option>
          )}
        </select>
        <input
          style={styles.input}
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button style={styles.button} onClick={handleSave}>
          Guardar Tarea
        </button>
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
    maxWidth: "400px",
    margin: "0 auto",
    width: "100%",
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
    fontFamily: "inherit",
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
