import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RegisterTeacherStep2 = () => {
    const navigate = useNavigate();
  const [form, setForm] = useState({
    academicSubjects: [],
    academicSpecialization: "",
    nonAcademicSubjects: [],
    nonAcademicSpecialization: "",
    experienceYears: "",
    compensation: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    console.log("Paso 2 - Docente:", form);
    navigate("/verify/teacher");
  };
  

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/register/teacher")}>←</button>
          <h2 style={styles.title}>Materias</h2>

          <div style={styles.steps}>
            {[1, 2, 3, 4].map((paso, index) => (
              <div key={index} style={styles.stepContainer}>
                <div
                  style={{
                    ...styles.stepCircle,
                    backgroundColor: paso <= 2 ? "#1ed760" : "#444",
                    color: paso <= 2 ? "#000" : "#ccc",
                  }}>
                  {paso}
                </div>
                {paso !== 4 && (
                  <div
                    style={{
                      ...styles.stepLine,
                      backgroundColor: paso < 2 ? "#1ed760" : "#666",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <h3 style={styles.section}>Materias Académicas</h3>
        <button
  style={styles.buttonOutline}
  onClick={() => navigate("/register/teacher/subjects/academic")}
>
  Agregar materias
</button>        
<input
          style={styles.input}
          placeholder="Especialización (opcional)"
          value={form.academicSpecialization}
          onChange={(e) => handleChange("academicSpecialization", e.target.value)}
        />

        <h3 style={styles.section}>Materias No Académicas</h3>
        <button
  style={styles.buttonOutline}
  onClick={() => navigate("/register/teacher/subjects/non-academic")}
>
  Agregar materias
</button>           <input
          style={styles.input}
          placeholder="Especialización (opcional)"
          value={form.nonAcademicSpecialization}
          onChange={(e) => handleChange("nonAcademicSpecialization", e.target.value)}
        />

        <div style={styles.row}>
          <input
            style={styles.inputSmall}
            placeholder="Años de experiencia"
            value={form.experienceYears}
            onChange={(e) => handleChange("experienceYears", e.target.value)}
          />
          <input
            style={styles.inputSmall}
            placeholder="Compensación (Bs)"
            value={form.compensation}
            onChange={(e) => handleChange("compensation", e.target.value)}
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>Continuar</button>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 600,
    color: "#fff",
    fontFamily: "sans-serif",
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 24,
    backgroundColor: "#1a1a1a",
    color: "#1ed760",
    border: "none",
    borderRadius: 8,
    padding: "5px 12px",
    cursor: "pointer",
    marginBottom: 10,
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: 10,
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
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
    margin: "0 5px",
  },
  section: {
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "20px 0 10px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 15,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  inputSmall: {
    flex: "1 1 45%",
    minWidth: "100px",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
  },
  buttonOutline: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "transparent",
    color: "#1ed760",
    border: "1px solid #1ed760",
    fontWeight: "bold",
    marginBottom: 15,
    cursor: "pointer",
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
    marginTop: 30,
    cursor: "pointer",
  },
};

export default RegisterTeacherStep2;
