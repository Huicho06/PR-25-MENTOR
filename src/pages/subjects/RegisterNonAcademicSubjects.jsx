// src/pages/subjects/RegisterNonAcademicSubjects.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterNonAcademicSubjects = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);

  const addSubject = () => {
    if (subject.trim() !== "") {
      setSubjects([...subjects, subject.trim()]);
      setSubject("");
    }
  };

  const removeSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const saveAndReturn = () => {
    console.log("Materias no académicas registradas:", subjects);
    navigate(-1);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.title}>Materias No Académicas</h2>

        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Nombre de la materia"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button style={styles.addBtn} onClick={addSubject}>Agregar</button>
        </div>

        <ul style={styles.list}>
          {subjects.map((item, index) => (
            <li key={index} style={styles.item}>
              {item}
              <button style={styles.deleteBtn} onClick={() => removeSubject(index)}>✕</button>
            </li>
          ))}
        </ul>

        <button style={styles.saveBtn} onClick={saveAndReturn}>Guardar y volver</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    padding: 20,
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 500,
    color: "#fff",
    fontFamily: "sans-serif",
  },
  backBtn: {
    fontSize: 20,
    backgroundColor: "#1a1a1a",
    color: "#1ed760",
    border: "none",
    borderRadius: 8,
    padding: "5px 12px",
    cursor: "pointer",
    marginBottom: 10,
  },
  title: {
    fontSize: "1.3rem",
    marginBottom: 15,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
  },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: 8,
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: 20,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: "10px 15px",
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteBtn: {
    backgroundColor: "transparent",
    color: "#ff4d4d",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  saveBtn: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default RegisterNonAcademicSubjects;
