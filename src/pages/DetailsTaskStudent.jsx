import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPaperclip } from "react-icons/fa";

const DetailsTaskStudent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { title, dueDate, points = 100, instructions = "20% de la nota de la Unidad 3", fileName = "Actividad 2.pdf" } = state || {};

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Volver
        </button>
        <div style={styles.pointsBox}>
          <p style={styles.pointsLabel}>Puntos</p>
          <p>{points} puntos posibles</p>
        </div>
      </div>

      <h2 style={styles.title}>{title}</h2>
      <p style={styles.dueDate}>Vence el {dueDate}</p>

      <div style={styles.section}>
        <p><strong>Instrucciones</strong></p>
        <p>{instructions}: {points}pts</p>
      </div>

      <div style={styles.section}>
        <p><strong>Materiales de referencia</strong></p>
        <div style={styles.materialBox}>
          <span>{fileName}</span>
        </div>
      </div>

      <div style={styles.section}>
        <p><strong>Mi trabajo</strong></p>
        <button style={styles.attachButton}>
          <FaPaperclip style={{ marginRight: "8px" }} /> Adjuntar
        </button>
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
  pointsBox: {
    textAlign: "right",
  },
  pointsLabel: {
    fontSize: "0.9rem",
    color: "#ccc",
    marginBottom: "2px",
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
