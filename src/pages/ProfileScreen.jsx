import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "/src/services/firebase"; // Asegúrate de tener la configuración de Firebase
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png"; // Logo de la app
import BottomNav from "../components/BottomNav"; // Importa el componente BottomNav
import personImage from "../assets/person.png";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // Para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Para controlar el estado de carga

  // Función para obtener los datos del usuario logueado
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser; // Obtén el usuario logueado

      if (user) {
        const userRef = doc(db, "usuarios", user.uid); // Obtener datos del usuario en Firestore usando el UID
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data()); // Guardar los datos del usuario en el estado
        } else {
          console.log("No se encontraron datos para este usuario");
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Si estamos cargando los datos, mostramos un loading spinner o mensaje
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si no hay datos de usuario, mostramos un mensaje
  if (!userData) {
    return <div>No se encontró el perfil</div>;
  }

  // Evitar el error si `especialidades` no está definido
  const specializations = userData.especialidades || []; // Si no hay especialidades, asignar un array vacío
  const specializationText = specializations.join(", ") || "No especificado"; // Unir las especializaciones, si no hay, poner "No especificado"

  return (
    <div style={styles.wrapper}>
      <div style={styles.profileContainer}>
        {/* Imagen de perfil */}
        <img
          src={userData.fotoPerfil || personImage} // Imagen por defecto si no tiene foto
          alt="Profile"
          style={styles.profileImage}
        />
        <div style={styles.profileInfo}>
          <h2 style={styles.profileTitle}>Mi Perfil</h2>
          <div style={styles.infoContainer}>
            
            <p style={styles.profileText}>
              <strong>Nombre completo:</strong>
              <span style={styles.profileValue}> {userData.nombre}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Teléfono:</strong>
              <span style={styles.profileValue}> {userData.telefono || "No disponible"}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Carrera:</strong>
              <span style={styles.profileValue}> {userData.carrera}</span>
            </p>
            
          </div>
          {/* Botón de editar perfil que redirige a la página de actualización */}
          <button style={styles.editProfileButton} onClick={() => navigate("/UpdateProfileStudent")}>
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Mantener el BottomNav */}
      <BottomNav />
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

export default ProfileScreen;
