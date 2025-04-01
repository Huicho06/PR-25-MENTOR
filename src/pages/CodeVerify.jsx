import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CodeVerify = ({ steps = 3 }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      // Si el valor es válido, mover al siguiente input
      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    console.log("Código ingresado:", code);
    // Validar OTP aquí, si es correcto
    navigate("/home"); // Redirige a la pantalla principal (HomeScreen)
  };
  

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Barra de pasos */}
        <div style={styles.steps}>
          {[...Array(steps)].map((_, i) => (
            <div key={i} style={styles.stepContainer}>
              <div
                style={{
                  ...styles.stepCircle,
                  backgroundColor: "#1ed760",
                  color: "#000",
                }}
              >
                {i + 1}
              </div>
              {i !== steps - 1 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>

        <h2 style={styles.title}>Verificación</h2>
        <p style={styles.subtitle}>
          Por favor ingresa el código enviado a <strong>+591 77777777</strong>
        </p>

        <div style={styles.otpContainer}>
          {otp.map((value, index) => (
            <input
              key={index}
              style={styles.otpInput}
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              ref={(el) => (inputRefs.current[index] = el)} // Asignar la referencia
            />
          ))}
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          Confirmar
        </button>

        <p style={styles.resend}>
          ¿No recibiste el código?{" "}
          <span style={styles.resendLink}>Reenviar código</span>
        </p>
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
    fontFamily: "sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 400,
  },
  steps: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 30,
  },
  stepContainer: {
    display: "flex",
    alignItems: "center",
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "24px",
    fontWeight: "bold",
    fontSize: 12,
  },
  stepLine: {
    width: 30,
    height: 2,
    backgroundColor: "#1ed760",
    margin: "0 5px",
  },
  title: {
    textAlign: "left",
    fontSize: "1.4rem",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "0.95rem",
    marginBottom: 30,
    color: "#ccc",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    border: "none",
    textAlign: "center",
    fontSize: 24,
    color: "#fff",
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
    marginBottom: 20,
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

export default CodeVerify;
