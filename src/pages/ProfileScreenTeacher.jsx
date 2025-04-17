import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase"; // Asegúrate de importar correctamente
import { getAuth } from "firebase/auth"; 
import { getDoc, doc } from "firebase/firestore"; 
import logo from "../assets/logo.png"; 
import personImage from "../assets/person.png"; 

const ProfileScreenTeacher = () => {
  const navigate = useNavigate();
  const [teacherData, setTeacherData] = useState(null); // Estado para almacenar los datos del docente

  useEffect(() => {
    const user = getAuth().currentUser; // Asegúrate de que la sesión esté activa
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "usuarios", user.uid); // Usamos el UID del usuario logueado para obtener los datos
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("teacherData: ", data); // Agrega este log para verificar los datos
          setTeacherData(data); // Establece los datos del docente en el estado
        }
      };
      fetchUserData();
    }
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  if (!teacherData) {
    return <div>Loading...</div>; // Mostrar un mensaje mientras se cargan los datos
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.profileContainer}>
        {/* Imagen de perfil */}
        <img
          src={teacherData.fotoPerfil || personImage} // Si no tiene foto, muestra la imagen predeterminada
          alt="Profile"
          style={styles.profileImage}
        />
        <div style={styles.profileInfo}>
          <h2 style={styles.profileTitle}>Mi Perfil</h2>
          <div style={styles.infoContainer}>
            <p style={styles.profileText}>
              <strong>Nombre completo:</strong>
              <span style={styles.profileValue}> {teacherData.nombre}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Teléfono:</strong>
              <span style={styles.profileValue}> {teacherData.telefono}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Carrera:</strong>
              <span style={styles.profileValue}> {teacherData.carrera}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Áreas de Especialización:</strong>
              <span style={styles.profileValue}> {teacherData.especializaciones.join(", ")}</span>
            </p>
          </div>
          {/* Botón de editar perfil que redirige a la página de actualización */}
          <button style={styles.editProfileButton} onClick={() => navigate("/UpdateProfileTeacher")}>
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Asegura que el BottomNav quede fijo abajo
    padding: "20px",
  },
  profileContainer: {
    backgroundColor: "#1a1a1a",
    padding: "30px",
    borderRadius: "15px",
    width: "80%",
    maxWidth: "900px", // Limita el tamaño máximo
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    margin: "auto", // Centra el contenedor
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  profileTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#1ed760",
  },
  profileInfo: {
    width: "100%",
    textAlign: "left",
    color: "#fff",
  },
  infoContainer: {
    marginBottom: "20px",
  },
  profileText: {
    fontSize: "1.1rem",
    margin: "10px 0",
    lineHeight: "1.5",
  },
  profileValue: {
    fontSize: "1.1rem",
    color: "#ccc",
    marginLeft: "10px",
  },
  editProfileButton: {
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "1rem",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "20px",
  },
};

export default ProfileScreenTeacher;
