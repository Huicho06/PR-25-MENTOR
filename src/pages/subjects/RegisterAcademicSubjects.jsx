import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterAcademicSubjects = () => {
  const navigate = useNavigate();
  const [materia, setMateria] = useState("");
  const [materias, setMaterias] = useState([]);

  const agregarMateria = () => {
    if (materia.trim() !== "") {
      setMaterias([...materias, materia.trim()]);
      setMateria("");
    }
  };

  const eliminarMateria = (index) => {
    const nuevas = materias.filter((_, i) => i !== index);
    setMaterias(nuevas);
  };

  const guardarYVolver = () => {
    console.log("Materias académicas registradas:", materias);
    navigate(-1); // Vuelve a la pantalla anterior
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>←</button>
        <h2 style={styles.title}>Materias Académicas</h2>

        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Nombre de la materia"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
          />
          <button style={styles.addBtn} onClick={agregarMateria}>Agregar</button>
        </div>

        <ul style={styles.list}>
          {materias.map((item, index) => (
            <li key={index} style={styles.item}>
              {item}
              <button style={styles.deleteBtn} onClick={() => eliminarMateria(index)}>✕</button>
            </li>
          ))}
        </ul>

        <button style={styles.saveBtn} onClick={guardarYVolver}>Guardar y volver</button>
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
    fontSize: 24,
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
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
  },
  addBtn: {
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "12px 20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: 30,
  },
  item: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: 6,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#f44336",
    fontSize: 16,
    cursor: "pointer",
  },
  saveBtn: {
    width: "100%",
    padding: 15,
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default RegisterAcademicSubjects;
