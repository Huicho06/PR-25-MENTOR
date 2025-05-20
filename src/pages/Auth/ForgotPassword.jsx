import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    setMessage(""); // limpiar mensaje previo
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email, {
        url: 'http://localhost:3000/login', // URL después de resetear contraseña (ajusta)
      });
      setModalVisible(true);
    } catch (err) {
      setMessage("Ocurrió un error: " + err.message);
    }
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.backBtn} onClick={() => navigate("/welcome")}>←</button>

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

        {message && <p>{message}</p>}

        {modalVisible && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <p>
                Te enviamos un mensaje a tu correo. Revisa para restablecer tu contraseña.
              </p>
              <div style={styles.modalButtons}>
                <button
                  style={styles.modalButton}
                  onClick={() => setModalVisible(false)}
                >
                  No me llegó
                </button>
                <button
                  style={styles.modalButton}
                  onClick={() => navigate("/login")}
                >
                  Sí me llegó
                </button>
              </div>
            </div>
          </div>
        )}
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
    position: "relative",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
    padding: 20,
    position: "relative",
    zIndex: 1,
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
    position: "absolute",
    top: "10px",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 10,
    width: 300,
    textAlign: "center",
    color: "#fff",
  },
  modalButtons: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    margin: "0 5px",
    padding: "10px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: 8,
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ForgotPassword;