import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";



const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correoIngresado = location.state?.correo || ""; 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
    } else if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
    } else {
      setError("");
  
      try {
        // Enviar un correo de restablecimiento de contraseña
        const auth = getAuth();
        await sendPasswordResetEmail(auth, correoIngresado); // Usamos el correo que el usuario ingresó para restablecer su contraseña
  
        console.log("Correo de restablecimiento enviado");
        navigate("/login"); // Redirigir a la pantalla de login
      } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        setError("Ocurrió un error al restablecer la contraseña");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
                            <button style={styles.backBtn} onClick={() => navigate("/welcome")}>
          ←
        </button>
      <div style={styles.container}>
        <h2 style={styles.title}>Cambiar Contraseña</h2>
        <p style={styles.subtitle}>
          Por favor, elige una contraseña que puedas recordar. Usa al menos 8
          caracteres, incluye números y letras para mayor seguridad.
        </p>
        
        {/* Nueva Contraseña */}
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"} // Cambiar tipo según el estado
          placeholder="Nueva Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Confirmar Contraseña */}
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"} // Cambiar tipo según el estado
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p style={styles.error}>{error}</p>}
        
        {/* Checkbox para mostrar/ocultar contraseñas */}
        <div style={styles.showPasswordContainer}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Alternar visibilidad
          />
          <label style={styles.showPasswordLabel}>Mostrar Contraseña</label>
        </div>

        <button style={styles.button} onClick={handlePasswordChange}>
          Guardar Contraseña
        </button>
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
    alignItems: "center",
    padding: 20,
    color: "#fff",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#ccc",
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
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: 30,
    cursor: "pointer",
  },
  showPasswordContainer: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  showPasswordLabel: {
    marginLeft: 10,
    fontSize: "0.9rem",
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
};

export default ChangePassword;
