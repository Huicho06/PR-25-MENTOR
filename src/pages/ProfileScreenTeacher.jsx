import React from "react";
import { useNavigate } from "react-router-dom"; // Importar el hook useNavigate
import BottomNav from "../components/BottomNavTeacher"; // Importa el componente BottomNav

// Simulación de datos del docente
const profileData = {
  username: "johndoe123",
  fullName: "John Doe",
  phone: "+1234567890",
  career: "Ingeniería de Sistemas",
  specialization: "Desarrollo Web , Desarrollo Movil", // Área de especialización añadida
  profileImage: "https://placeimg.com/150/150/people", // Imagen de perfil simulada
};

const ProfileScreenTeacher = () => {
  const navigate = useNavigate(); // Usar el hook useNavigate para navegar entre pantallas

  // Función para manejar la redirección cuando se hace clic en "Editar Perfil"
  const handleEditProfile = () => {
    navigate("/UpdateProfileTeacher"); // Redirige al UpdateProfileTeacher
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.profileContainer}>
        {/* Imagen de perfil */}
        <img
          src={profileData.profileImage}
          alt="Profile"
          style={styles.profileImage}
        />
        <div style={styles.profileInfo}>
          <h2 style={styles.profileTitle}>Mi Perfil</h2>
          <div style={styles.infoContainer}>
            <p style={styles.profileText}>
              <strong>Nombre de usuario:</strong>
              <span style={styles.profileValue}> {profileData.username}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Nombre completo:</strong>
              <span style={styles.profileValue}> {profileData.fullName}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Teléfono:</strong>
              <span style={styles.profileValue}> {profileData.phone}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Carrera:</strong>
              <span style={styles.profileValue}> {profileData.career}</span>
            </p>
            <p style={styles.profileText}>
              <strong>Áreas de Especialización:</strong>
              <span style={styles.profileValue}> {profileData.specialization}</span> {/* Área de especialización añadida */}
            </p>
          </div>
          {/* Botón de editar perfil que redirige a la página de actualización */}
          <button style={styles.editProfileButton} onClick={handleEditProfile}>
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

export default ProfileScreenTeacher;
