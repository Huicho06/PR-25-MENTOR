import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase"; // Asegúrate de importar correctamente
import { getAuth } from "firebase/auth"; 
import { getDoc, doc, updateDoc } from "firebase/firestore"; 
import logo from "../assets/logo.png"; 


const UpdateProfileTeacher = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [teacherData, setTeacherData] = useState(null); // Para almacenar los datos del docente
  const [name, setName] = useState("");
  const [career, setCareer] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specializations, setSpecializations] = useState([]); // Para las áreas de especialización

  // Función para cargar los datos del docente
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "usuarios", user.uid); // Obtener datos del usuario logueado
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setTeacherData(data); // Actualiza el estado con los datos del docente
          setName(data.nombre || "");
          setCareer(data.carrera || "");
          setPhoneNumber(data.telefono || "");
          setSpecializations(data.especializaciones || []); // Cargar especializaciones
        }
      };
      fetchUserData();
    }
  }, [auth]);

  // Función para manejar cambios en la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para manejar las especializaciones seleccionadas
  const handleSpecializationsChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Limitar la selección a 4 especializaciones
      if (specializations.length < 4) {
        setSpecializations([...specializations, value]);
      }
    } else {
      setSpecializations(specializations.filter((specialization) => specialization !== value));
    }
  };

  // Función para manejar los cambios de perfil
  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No estás logueado.");
        return;
      }

      // Actualizamos los datos del docente en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const updatedData = {
        nombre: name,
        carrera: career,
        telefono: phoneNumber,
        fotoPerfil: profileImage ? profileImage.name : null, // Solo si se sube una nueva imagen
        especializaciones: specializations, // Actualizar especializaciones
      };

      await updateDoc(userRef, updatedData); // Actualiza los datos del usuario en Firestore

      console.log("Perfil actualizado correctamente");
      navigate("/mainTeacher"); // Redirige a la página principal
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  // Cargar los datos de perfil, si no están listos, muestra "Loading..."
  if (!teacherData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <img src={logo} alt="Logo Mentor" style={styles.logo} />

        {/* Título de la página */}
        <h2 style={styles.title}>Modificar Perfil de Tutor</h2>

        {/* Campo de nombre */}
        <input
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Campo de carrera (Combobox) */}
        <select
          style={styles.input}
          value={career}
          onChange={(e) => setCareer(e.target.value)}
        >
          <option value="" disabled>Selecciona tu carrera</option>
          <option value="Ingeniería en Sistemas Informáticos">Ingeniería en Sistemas Informáticos</option>
          <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
          <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
          <option value="Ingeniería de Telecomunicaciones">Ingeniería de Telecomunicaciones</option>
        </select>

        {/* Campo de teléfono */}
        <input
          style={styles.input}
          placeholder="Número de teléfono"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {/* Subir foto de perfil */}
        <input
          type="file"
          accept="image/*"
          style={styles.fileInput}
          onChange={handleImageChange}
        />

        {/* Vista previa de la imagen */}
        {imagePreview && (
          <img src={imagePreview} alt="Vista previa" style={styles.previewImage} />
        )}

        {/* Campo para áreas de especialización */}
        <div style={styles.checkboxSection}>
          <h3 style={styles.checkboxTitle}>Áreas de Especialización</h3>
          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="Ingeniería de Software"
                checked={specializations.includes("Ingeniería de Software")}
                onChange={handleSpecializationsChange}
              />
              Ingeniería de Software
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="Redes y Comunicaciones"
                checked={specializations.includes("Redes y Comunicaciones")}
                onChange={handleSpecializationsChange}
              />
              Redes y Comunicaciones
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="Inteligencia Artificial"
                checked={specializations.includes("Inteligencia Artificial")}
                onChange={handleSpecializationsChange}
              />
              Inteligencia Artificial
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="Bases de Datos"
                checked={specializations.includes("Bases de Datos")}
                onChange={handleSpecializationsChange}
              />
              Bases de Datos
            </label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value="Seguridad Informática"
                checked={specializations.includes("Seguridad Informática")}
                onChange={handleSpecializationsChange}
              />
              Seguridad Informática
            </label>
          </div>
        </div>

        {/* Mensaje si se alcanza el límite de especializaciones */}
        {specializations.length > 4 && (
          <p style={styles.errorMessage}>Puedes seleccionar hasta 4 especializaciones.</p>
        )}

        {/* Botón de guardar */}
        <button style={styles.button} onClick={handleSubmit}>
          Guardar Perfil
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
  logo: {
    width: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: 20,
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
  fileInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 20,
  },
  previewImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: 20,
  },
  checkboxSection: {
    marginBottom: 20,
  },
  checkboxTitle: {
    fontSize: "1.2rem",
    marginBottom: 10,
    color: "#fff",
  },
  checkboxContainer: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  checkboxLabel: {
    marginBottom: "30px", // Espaciado entre cada checkbox
    color: "#fff",
  },
  errorMessage: {
    color: "red",
    fontSize: "0.9rem",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default UpdateProfileTeacher;
