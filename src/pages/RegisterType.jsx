import { useNavigate } from "react-router-dom";

const RegisterType = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¿Cómo deseas registrarte?</h1>

      <button style={styles.button} onClick={() => navigate("/register/teacher")}>
        🧑‍🏫 Soy Tutor
      </button>
      <button style={styles.button} onClick={() => navigate("/register/student")}>
        🎓 Soy Tesista
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
    fontSize: "1.6rem",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    padding: "15px 30px",
    margin: "10px 0",
    fontSize: "1rem",
    fontWeight: "bold",
    width: "80%",
    maxWidth: 300,
    cursor: "pointer",
  },
};

export default RegisterType;
