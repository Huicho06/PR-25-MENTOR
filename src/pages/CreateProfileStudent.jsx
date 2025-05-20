import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase";  // Importar desde el archivo firebase.js
import { getAuth } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";  // Para leer y escribir en Firestore
import logo from "../assets/logo.png";  // Logo de la app
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

const CreateProfileStudent = () => {
  const navigate = useNavigate();
  const auth = getAuth(); // Obtener la autenticación de Firebase
  const [name, setName] = useState("");  // Nombre del estudiante
  const [career, setCareer] = useState("");  // Carrera
  const [phoneNumber, setPhoneNumber] = useState("");  // Teléfono
  const [imagePreview, setImagePreview] = useState(null); // Vista previa de la imagen
  const [userData, setUserData] = useState(null);  // Para almacenar los datos del usuario
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

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;  // Obtener el usuario logueado

      // Actualizar los datos del perfil en Firestore
      const userRef = doc(db, "usuarios", user.uid);
      const updatedData = {
        nombre: name,
        carrera: career,
        telefono: phoneNumber,
        fotoPerfil: photoURL,  // No subir foto
        perfilCompletado: true,  // Cambiar a true cuando el perfil esté completado
      };

      await setDoc(userRef, updatedData, { merge: true });  // Merge para no sobrescribir otros datos
      console.log("Perfil actualizado correctamente");

      // Redirigir al usuario a la página principal correspondiente
      navigate("/main");  // Redirigir a la vista principal para estudiantes

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };
  const handlePhoneChange = (e) => {
  const valor = e.target.value;

  // Permitir vacío
  if (valor === "") {
    setPhoneNumber("");
    return;
  }

  // Solo números permitidos
  const regex = /^[0-9]*$/;

  if (regex.test(valor)) {
    setPhoneNumber(valor);
  }
  // Si no es número, no actualiza
};


  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Logo */}
        <img src={logo} alt="Logo Mentor" style={styles.logo} />

        {/* Título de la página */}
        <h2 style={styles.title}>Crear Perfil de Estudiante</h2>

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
          onChange={handlePhoneChange}  // Asignar el valor del teléfono
        />

        {/* Mostrar imagen de perfil, sin carga de archivo */}
        <div style={styles.previewImageContainer}>
          {imagePreview ? (
            <img src={imagePreview} alt="Vista previa" style={styles.previewImage} />
          ) : (
            <p>No hay imagen seleccionada.</p>
          )}
        </div>

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
              reader.readAsDataURL(file);  // Mostrar la imagen seleccionada
              try {
              const { url } = await uploadToCloudinary(file);
              setPhotoURL(url);
            } catch (error) {
              console.error("Error subiendo la imagen:", error);
              alert("No se pudo subir la imagen. Intenta nuevamente.");
            }
            }
          }}
        />

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
  previewImageContainer: {
    marginBottom: 20,
  },
  previewImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
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

export default CreateProfileStudent;