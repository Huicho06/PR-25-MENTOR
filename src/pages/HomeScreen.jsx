import { useNavigate } from "react-router-dom";

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Imagen de fondo */}
        <div style={styles.backgroundImage}></div>

        {/* Contenido */}
        <div style={styles.content}>
          <h1 style={styles.title}>MENTOR</h1>
          <p style={styles.description}>
            Mentor es una aplicación diseñada para facilitar la comunicación entre
            tesistas y tutores, permitiendo la gestión de tutores, seguimiento de
            avances y la asignación de tareas dentro del ámbito académico.
          </p>
          <button
            style={styles.button}
            onClick={() => navigate("/CreateProfileStudent")}
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
    justifyContent: "center",
    padding: 20,
    color: "#fff",
  },
  container: {
    width: "100%",
    maxWidth: 500,
    textAlign: "center",
    position: "relative",
    padding: 20,
  },
  backgroundImage: {
    backgroundImage: "url('./assets/ingChristianFrente.jpg')", // Cambié la ruta a la imagen correcta
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "60%",
    borderRadius: "15px",
  },
  content: {
    position: "absolute",
    bottom: "20px",
    left: "0",
    right: "0",
    padding: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: "15px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: "1rem",
    color: "#ccc",
    marginBottom: 20,
  },
  button: {
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

export default HomeScreen;
