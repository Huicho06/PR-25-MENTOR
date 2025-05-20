import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "/src/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png"; 

const HomeScreen = () => {
  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;  // Obtener el usuario logueado

    if (user) {
      // Si el usuario está logueado, buscamos su tipo en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Si el perfil no está completado, lo redirigimos a la página de creación de perfil
        if (!userData.perfilCompletado) {
          if (userData.tipo === "student") {
            navigate("/CreateProfileStudent");  // Redirigir a la página de creación de perfil para estudiante
          } else {
            navigate("/CreateProfileTeacher");  // Redirigir a la página de creación de perfil para docente
          }
        } 
      }
    }
  };
   return (
    <div style={styles.wrapper}>
      {/* Logo fuera del container */}
      <img src={logo} alt="Logo Mentor" style={styles.logoOutside} />

      <div style={styles.container}>
        {/* Contenido */}
        <div style={styles.content}>
          
          <p style={styles.subtitle}>
            Conecta, aprende y avanza en tu proyecto académico con tu tutor.
          </p>
          <p style={styles.description}>
            Mentor es una aplicación diseñada para facilitar la comunicación entre
            tesistas y tutores, permitiendo la gestión de tutores, seguimiento de
            avances y la asignación de tareas dentro del ámbito académico.
          </p>
          <p style={styles.instruction}>
            Comienza configurando tu perfil para acceder a todas las funcionalidades.
          </p>
          <button
            style={styles.button}
            onClick={handleCreateProfile} 
          >
            Crear Perfil
          </button>
        </div>
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
    justifyContent: "center",
    alignItems: "center",  // Centra horizontalmente todo
    padding: 20,
    color: "#fff",
  },
  logoOutside: {
    width: 680,  // Más grande
    marginBottom: 40,
    opacity: 0.9,
  },
  container: {
    width: "100%",
    maxWidth: 500,
    textAlign: "center",
    position: "relative",
    padding: 20,
    backgroundColor: "#121212",
    borderRadius: 15,
    boxShadow: "0 0 15px #1ed760a0",
  },
  content: {
    padding: "10px 30px",
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: "1.5rem",
    color: "#1ed760",
    marginBottom: 20,
    fontWeight: "600",
  },
  description: {
    fontSize: "1.2rem",
    color: "#ccc",
    marginBottom: 25,
    lineHeight: 1.6,
  },
  instruction: {
    fontSize: "1.2rem",
    color: "#aaffaa",
    marginBottom: 30,
    fontWeight: "600",
  },
  button: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 12,
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default HomeScreen;
