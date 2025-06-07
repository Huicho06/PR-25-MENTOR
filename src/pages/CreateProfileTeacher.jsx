import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase";  // Importar desde el archivo firebase.js
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";  // Para leer y escribir en Firestore
import logo from "../assets/logo.png";  // Logo de la app
import { uploadToCloudinary } from "../utils/uploadToCloudinary";


const CreateProfileTeacher = () => {
  const navigate = useNavigate();
  const auth = getAuth();  // Obtener la autenticación de Firebase
  const [name, setName] = useState("");  // Nombre del docente
  const [career, setCareer] = useState("");  // Carrera
  const [phoneNumber, setPhoneNumber] = useState("");  // Teléfono
  const [specializations, setSpecializations] = useState([]);  // Áreas de especialización
  const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen
  const [userData, setUserData] = useState(null);  // Para almacenar los datos del usuario
  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  // Cargar los datos del usuario al iniciar la página
  useEffect(() => {
    const user = auth.currentUser;  // Obtener el usuario autenticado
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "usuarios", user.uid);  // Obtener datos del usuario en Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());  // Guardar los datos en el estado
          setName(userDoc.data().nombre || "");  // Asignar el nombre al estado
          setCareer(userDoc.data().carrera || "");
          setPhoneNumber(userDoc.data().telefono || "");
        }
      };
      fetchUserData();  // Ejecutar la función para cargar los datos
    }
  }, [auth]);

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

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;  // Obtener el usuario logueado
      if (!user) return;

     

      // Actualizar los datos del perfil en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const updatedData = {
        nombre: name,
        carrera: career,
        telefono: phoneNumber,
        especializaciones: specializations,  // Guardar especializaciones
        perfilCompletado: true,  // Cambiar a `true` cuando el perfil esté completado
        fotoPerfil: photoURL,
      };

      await setDoc(userRef, updatedData, { merge: true });  // Merge para no sobrescribir los otros datos
      console.log("Perfil actualizado correctamente");

      // Redirigir al usuario a la página principal correspondiente
      navigate("/mainTeacher");  // Redirigir a la vista de tutor

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <img src={logo} alt="Logo Mentor" style={styles.logo} />

        {/* Título de la página */}
        <h2 style={styles.title}>Crear Perfil de Tutor</h2>

        {/* Campo de nombre */}
        <input
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}  // Asignar el valor del nombre
        />

        {/* Campo de carrera (Combobox) */}
        <select
          style={styles.input}
          value={career}
          onChange={(e) => setCareer(e.target.value)}  // Asignar el valor de la carrera
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
          onChange={(e) => {
            const valor = e.target.value;
            // Permitir solo dígitos
            if (/^\d*$/.test(valor)) {
              setPhoneNumber(valor);
            }
          }}
          inputMode="numeric"
          pattern="[0-9]*"
        />


        {/* Mostrar imagen de perfil */}
        <div style={styles.previewImageContainer}>
          {imagePreview ? (
            <img src={imagePreview} alt="Vista previa" style={styles.previewImage} />
          ) : (
            <p>No hay imagen seleccionada.</p>
          )}
        </div><br></br><br></br>

        {/* Campo para subir foto de perfil (sin funcionalidad) */}
        <input
          type="file"
          accept="image/*"
          style={styles.fileInput}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImagePreview(reader.result);
              };
              reader.readAsDataURL(file);
              try {
                const { url } = await uploadToCloudinary(file);
                setPhotoURL(url); // Solo la URL aquí también
              } catch (error) {
                console.error("Error subiendo la imagen:", error);
                alert("No se pudo subir la imagen. Intenta nuevamente.");
              }
            }
          }}
        /><br></br><br></br>

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
    previewImageContainer: {
    width: "100%",
    height: "200px",
    border: "2px dashed #1ed760",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  previewImage: {
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "cover",
    borderRadius: "8px",
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

export default CreateProfileTeacher;
