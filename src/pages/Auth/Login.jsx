import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; // Ajusta la ruta según la estructura de carpetas

const Login = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
              <button style={styles.backBtn} onClick={() => navigate("/welcome")}>
          ←
        </button>

      <div style={styles.container}>
        {/* Botón de retroceder en la esquina superior izquierda */}

        <img
          src={logo}
          alt="Logo Mentor"
          style={{ width: "300px", marginTop: "-160px", marginBottom: "120px" }} // Ajusta el valor negativo para moverlo hacia arriba
        />

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
    position: "relative", // Para posicionar el botón de retroceder
  },
  backBtn: {
    fontSize: "24px",
    backgroundColor: "#1a1a1a",
    color: "#1ed760",
    border: "none",
    borderRadius: "8px",
    padding: "5px 12px",
    cursor: "pointer",
    position: "absolute", // Posición absoluta en la esquina
    top: "10px", // Asegúrate de que esté justo en la esquina superior izquierda
    left: "10px",
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
  logo: {
    width: 150, // Tamaño del logo, ajusta según sea necesario
    marginBottom: 30, // Espaciado para separar el logo del resto del formulario
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
};

export default Login;
