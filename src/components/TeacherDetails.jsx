import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import personImage from "../assets/person.png";

const TeacherDetails = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const docRef = doc(db, "usuarios", mentorId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTeacher(docSnap.data());
        } else {
          console.error("Docente no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el docente:", error);
      }
    };

    fetchTeacher();
  }, [mentorId]);

  if (!teacher) return <p style={styles.loading}>Cargando detalles del docente...</p>;

  return (
    <div style={styles.wrapper}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>⬅ Volver</button>

      <div style={styles.card}>
        <div style={styles.header}>
<img
  src={teacher.fotoPerfil ? teacher.fotoPerfil : personImage}
  alt="Foto de perfil"
  style={styles.profileImage}
/>
          <h2 style={styles.name}>{teacher.nombre}</h2>
        </div>

        <div style={styles.infoContent}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Correo:</span>
            <span style={styles.value}>{teacher.correo}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Teléfono:</span>
            <span style={styles.value}>{teacher.telefono}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Carrera:</span>
            <span style={styles.value}>{teacher.carrera}</span>
          </div>

          <div style={{ ...styles.label, marginTop: "20px" }}>Especializaciones:</div>
          <ul style={styles.specializations}>
            {teacher.especializaciones?.map((esp, i) => (
              <li key={i} style={styles.specializationItem}>• {esp}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#fff",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    color: "#1ed760",
    border: "1px solid #1ed760",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "30px"
  },
  card: {
    background: "rgba(30, 30, 30, 0.95)",
    borderRadius: "16px",
    padding: "30px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 0 20px rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  profileImage: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    border: "3px solid #1ed760",
    objectFit: "cover",
    marginBottom: "10px"
  },
  name: {
    fontSize: "1.8rem",
    fontWeight: "600",
    marginBottom: "0",
  },
  infoContent: {
    textAlign: "left",
    padding: "0 55px", // ← padding lateral aplicado aquí
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    fontSize: "1rem",
    gap: "12px"
  },
  label: {
    fontWeight: "bold",
    color: "#1ed760",
  },
  value: {
    textAlign: "right",
    color: "#fff",
    maxWidth: "60%",
  },
  specializations: {
    listStyleType: "none",
    paddingLeft: "20px",
    marginTop: "10px",
  },
  specializationItem: {
    marginBottom: "8px",
    fontSize: "1rem",
    color: "#eee",
  },
  loading: {
    textAlign: "center",
    color: "#fff",
    marginTop: "50px",
  }
};

export default TeacherDetails;
