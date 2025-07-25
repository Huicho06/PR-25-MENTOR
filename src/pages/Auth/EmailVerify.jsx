import { useState, useRef } from "react";
import { useNavigate , useLocation} from "react-router-dom";

import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase"; // Ajusta esto si es necesario


const EmailVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [correoIngresado, setCorreoIngresado] = useState(location.state?.correo || ""); // Usar el correo pasado en el state
  const [error, setError] = useState("");
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

  const handleSubmit = async() => {
    const code = otp.join("");
    console.log("Código ingresado:", code);
    
    try {
      if (!correoIngresado) {
        setError("Por favor ingrese su correo electrónico.");
        return;
      }
      // Buscar el código guardado en Firestore
      const docId = correoIngresado.replace(/\./g, "_");
      const ref = doc(db, "recuperaciones", docId); 
      const docSnap = await getDoc(ref);      
  
      if (!docSnap.exists()) {
        console.log("No se encontró el documento en Firestore");
        setError("Este código es inválido o ha expirado");
        return;
      }
  
      const data = docSnap.data();
      //console.log("Datos obtenidos de Firestore:", data);

      if (data) {
      const codigoGuardado = data.codigo;
      const expiracion = data.expiracion ? data.expiracion.toDate() : null;

      // Verificar que el código no haya expirado
      const ahora = new Date();

      if (!(expiracion instanceof Date)) {
        setError("La fecha de expiración es inválida");
        return;
      }

      if (ahora.getTime() > expiracion.getTime()) {
        setError("El código ha expirado");
        return;
      }
      // Comparar el código ingresado con el guardado
      if (code === codigoGuardado) {
        navigate("/changepassword", { state: { correo: correoIngresado } }); // Redirigir a la pantalla para cambiar la contraseña
      } else {
        setError("El código ingresado es incorrecto");
      }

    }



      
    } catch (error) {
      console.error("Error al verificar el código:", error);
      setError("Ocurrió un error al verificar el código");
    }

  };

  return (
    <div style={styles.wrapper}>
        <button style={styles.backBtn} onClick={() => navigate("/welcome")}>
          ←
        </button>
      <div style={styles.container}>
        <h2 style={styles.title}>Verificación de correo electrónico</h2>
        <p style={styles.subtitle}>
          Por favor ingresa el código enviado a <strong>{correoIngresado}</strong>
        </p>

        {/* <input
          type="email"
          value={correoIngresado}
          onChange={(e) => setCorreoIngresado(e.target.value)}  // Captura el correo
          placeholder="Correo electrónico"
          style={styles.input}
        /> */}
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

        {error && <p style={styles.error}>{error}</p>}  {/* Mostrar el error si hay */}

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
    justifyContent: "center", // Centrado horizontal
    alignItems: "center", // Centrado vertical
    padding: 20,
    color: "#fff",
    fontFamily: "sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: 400,
    textAlign: "center",
    padding: 20,
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: 20,

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

export default EmailVerify; // Asegúrate de que esta línea esté aquí
