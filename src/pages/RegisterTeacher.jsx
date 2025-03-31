import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RegisterTeacher = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: { day: "", month: "", year: "" },
    gender: "",
    qualification: "",
    experience: "",
    languages: "",
    about: "",
    city: "",
    state: "",
    address1: "",
    address2: "",
    pincode: "",
    classType: "",
    catchment: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleDOBChange = (part, value) => {
    setForm({ ...form, dob: { ...form.dob, [part]: value } });
  };

  const handleSubmit = () => {
    console.log("Datos del docente:", form);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate("/registertype")}>←</button>
          <h2 style={styles.title}>Your Details</h2>

          <div style={styles.steps}>
            {[1, 2, 3, 4].map((step, index) => (
              <div key={index} style={styles.stepContainer}>
                <div style={{
                  ...styles.stepCircle,
                  backgroundColor: step <= 2 ? "#1ed760" : "#444",
                  color: step <= 2 ? "#000" : "#ccc"
                }}>
                  {step}
                </div>
                {step !== 4 && <div style={{
                  ...styles.stepLine,
                  backgroundColor: step < 2 ? "#1ed760" : "#666"
                }} />}
              </div>
            ))}
          </div>
        </div>

        {/* FORM */}
        <input style={styles.input} placeholder="Name" value={form.name} onChange={e => handleChange("name", e.target.value)} />
        <input style={styles.input} placeholder="Email id" value={form.email} onChange={e => handleChange("email", e.target.value)} />
        <input style={styles.input} placeholder="Phone number" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />

        <div style={styles.row}>
          <input style={styles.inputSmall} placeholder="DD" value={form.dob.day} onChange={e => handleDOBChange("day", e.target.value)} />
          <input style={styles.inputSmall} placeholder="MM" value={form.dob.month} onChange={e => handleDOBChange("month", e.target.value)} />
          <input style={styles.inputSmall} placeholder="YYYY" value={form.dob.year} onChange={e => handleDOBChange("year", e.target.value)} />
        </div>

        <div style={styles.row}>
          <label style={styles.radio}>
            <input type="radio" name="gender" value="male" onChange={() => handleChange("gender", "male")} /> Male
          </label>
          <label style={styles.radio}>
            <input type="radio" name="gender" value="female" onChange={() => handleChange("gender", "female")} /> Female
          </label>
        </div>

        <input style={styles.input} placeholder="Highest Qualification" value={form.qualification} onChange={e => handleChange("qualification", e.target.value)} />
        <input style={styles.input} placeholder="Years of experience" value={form.experience} onChange={e => handleChange("experience", e.target.value)} />
        <input style={styles.input} placeholder="Languages known" value={form.languages} onChange={e => handleChange("languages", e.target.value)} />
        <textarea style={styles.textarea} placeholder="Write something about you..." value={form.about} onChange={e => handleChange("about", e.target.value)} />

        <h3 style={styles.section}>Your home address</h3>
        <input style={styles.input} placeholder="City*" value={form.city} onChange={e => handleChange("city", e.target.value)} />
        <input style={styles.input} placeholder="State*" value={form.state} onChange={e => handleChange("state", e.target.value)} />
        <input style={styles.input} placeholder="House no." value={form.address1} onChange={e => handleChange("address1", e.target.value)} />
        <input style={styles.input} placeholder="Address line 2" value={form.address2} onChange={e => handleChange("address2", e.target.value)} />
        <input style={styles.input} placeholder="Pincode" value={form.pincode} onChange={e => handleChange("pincode", e.target.value)} />

        <h3 style={styles.section}>Set your preferred class type</h3>
        <input style={styles.input} placeholder="Real Class" value={form.classType} onChange={e => handleChange("classType", e.target.value)} />
        <input style={styles.input} placeholder="Catchment Area" value={form.catchment} onChange={e => handleChange("catchment", e.target.value)} />

        <button style={styles.button} onClick={handleSubmit}>Proceed</button>
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
    maxWidth: 600, // ← antes era 420
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
  textarea: {
    width: "100%",
    height: 80,
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
    flexWrap: "wrap", // ← Agregado
  },
  
  inputSmall: {
    flex: "1 1 30%", // ← Ajuste flexible para que hagan wrap si es necesario
    minWidth: "80px", // ← Para que no se hagan microscópicos
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
  },
  
  radio: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.95rem",
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

export default RegisterTeacher;
