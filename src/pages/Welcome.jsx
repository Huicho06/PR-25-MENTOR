import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido</h1>
      <p style={styles.subtitle}>Por favor inicia sesión o regístrate si eres un usuario nuevo</p>

      <button style={styles.button} onClick={() => navigate("/login")}>
        Inicia Sesión
      </button>
      <button style={styles.button} onClick={() => navigate("/registertype")}>
        Regístrate
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0a0a0a",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "1rem",
    marginBottom: 30,
    color: "#aaa",
  },
  button: {
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    padding: "12px 30px",
    margin: "10px 0",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "80%",
    maxWidth: 300,
  },
};

export default Welcome;
