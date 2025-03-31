import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Iniciar sesión</h2>

        <input style={styles.input} placeholder="Correo electrónico" />
        <input style={styles.input} type="password" placeholder="Contraseña" />

        <button style={styles.button} onClick={() => navigate("/home")}>
          Iniciar sesión
        </button>

        <p style={styles.forgotPassword} onClick={() => navigate("/forgot-password")}>
  Olvidé mi contraseña
</p>

      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh", // Esto asegura que el contenedor ocupe toda la altura de la pantalla
    display: "flex",
    justifyContent: "center", // Centra horizontalmente
    alignItems: "center", // Centra verticalmente
    padding: 20,
    color: "#fff",
  },
  container: {
    width: "100%",
    maxWidth: 400, // Tamaño máximo para los formularios
    textAlign: "center",
    padding: 20,
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 20,
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
  forgotPassword: {
    fontSize: "0.9rem",
    color: "#1ed760",
    cursor: "pointer",
    textDecoration: "underline",
  },
  resend: {
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#999",
  },
  resendLink: {
    color: "#1ed760",
    cursor: "pointer",
  },
};

export default Login;
