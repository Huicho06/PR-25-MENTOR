import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Inicia Sesión</h1>
        <p style={styles.subtitle}>Ingresa tu nombre de usuario para iniciar sesión</p>

        <input type="text" placeholder="Nombre de usuario" style={styles.input} />

        <button style={styles.button}>Iniciar Sesión</button>

        <p style={styles.registerText}>
          ¿Usuario nuevo?{" "}
          <span style={styles.registerLink} onClick={() => navigate("/register")}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 350,
    textAlign: "left",
    color: "#fff",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "0.95rem",
    marginBottom: 30,
    color: "#ccc",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: 20,
    borderRadius: 10,
    border: "none",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: 20,
    cursor: "pointer",
  },
  registerText: {
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#aaa",
  },
  registerLink: {
    color: "#1ed760",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default Login;
