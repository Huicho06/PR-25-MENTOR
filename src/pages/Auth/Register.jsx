import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../services/auth"; 
import logo from "../../assets/logo.png"; // Ajusta la ruta según la estructura de carpetas

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student"); // Default to "student"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseñas
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };


  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // Llamamos a la función de registro
      await registrarUsuario(form.email, form.password, `${form.firstName} ${form.lastName}`, role);
      console.log("Usuario registrado correctamente");
      navigate("/CreateProfileTeacher");  // Redirigir a la página principal (puedes ajustar esta ruta)
    } catch (err) {
      setError(err.message); 
    }
  };



  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
      <img
  src={logo}
  alt="Logo Mentor"
  style={{ width: "300px", marginTop: "-20px",marginBottom: "80px" }} // Ajusta el valor negativo para moverlo hacia arriba
/>


        {/* Botón de retroceder */}
        <button style={styles.backBtn} onClick={() => navigate("/welcome")}>
          ←
        </button>

        {/* Elección de Tesista o Tutor */}
        <div style={styles.roleSelection}>
          <div
            style={{
              ...styles.roleOption,
              backgroundColor: role === "student" ? "#1ed760" : "#444",
              color: role === "student" ? "#fff" : "#ccc",
            }}
            onClick={() => handleRoleChange("student")}
          >
            Tesista
          </div>
          <div
            style={{
              ...styles.roleOption,
              backgroundColor: role === "teacher" ? "#1ed760" : "#444",
              color: role === "teacher" ? "#fff" : "#ccc",
            }}
            onClick={() => handleRoleChange("teacher")}
          >
            Tutor
          </div>
        </div>

        {/* Formulario */}
        <input
          style={styles.input}
          placeholder="Nombre"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Apellido"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Correo Institucional"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"} // Cambia tipo según estado
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />
        <input
          style={styles.input}
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar Contraseña"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
        />
        {/* Mostrar el error si existe */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Checkbox para mostrar/ocultar contraseñas */}
        <div style={styles.showPasswordContainer}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Cambia el estado de visibilidad
          />
          <label style={styles.showPasswordLabel}>Mostrar Contraseña</label>
        </div>

        {/* Botón de envío */}
        <button style={styles.button} onClick={handleSubmit}>
          Crear Cuenta
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
    maxWidth: 600,
    color: "#fff",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  logo: {
    width: 150, // Tamaño del logo, ajusta según sea necesario
    marginBottom: 30, // Espaciado para separar el logo del resto del formulario
  },
  backBtn: {
    fontSize: 24,
    backgroundColor: "#1a1a1a",
    color: "#1ed760",
    border: "none",
    borderRadius: "8px",
    padding: "5px 12px",
    cursor: "pointer",
    marginBottom: 20,
    position: "absolute",
    left: 20,
    top: 20,
  },
  roleSelection: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 30,
  },
  roleOption: {
    padding: "10px 20px",
    margin: "0 10px",
    cursor: "pointer",
    borderRadius: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 20,
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
  error: {
    color: "red", 
    fontSize: "0.9rem", 
    fontWeight: "bold", 
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
};

export default Register;
