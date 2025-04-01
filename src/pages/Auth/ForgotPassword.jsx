import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Email enviado a:", email);
    // Aquí puedes integrar el proceso de envío de enlace o código para recuperar la contraseña.
    navigate("/verify/email"); // Redirigir a la página de verificación por correo.
  };

  return (
    
    <div style={styles.wrapper}>
                    <button style={styles.backBtn} onClick={() => navigate("/welcome")}>
          ←
        </button>

      <div style={styles.container}>
        <h2 style={styles.title}>Recuperar Contraseña</h2>
        <input
          style={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button style={styles.button} onClick={handleSubmit}>
          Enviar enlace de recuperación
        </button>
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
  

export default ForgotPassword;
