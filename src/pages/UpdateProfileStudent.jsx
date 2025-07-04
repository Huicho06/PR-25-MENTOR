import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "/src/services/firebase";  // Asegúrate de que la importación sea correcta
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";  // Para obtener y actualizar datos
import logo from "../assets/logo.png";
import BottomNav from "../components/BottomNav";  // Logo de la app
import personImage from "../assets/person.png";
import { updateProfile } from "firebase/auth";
import { uploadToCloudinary } from "../utils/uploadToCloudinary"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const UpdateProfileStudent = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  
  // Datos de perfil inicial (simulación, normalmente vendrían de la base de datos o API)
  const [name, setName] = useState("");
  const [career, setCareer] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Obtener los datos del usuario logueado
    const user = auth.currentUser;
    if (user) {
      const fetchUserData = async () => {
        const userRef = doc(db, "usuarios", user.uid); // Obtener datos del usuario en Firestore
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          // Si el documento existe, llenar los campos con los datos del usuario
          const userData = userDoc.data();
          setName(userData.nombre || "");
          setCareer(userData.carrera || "");
          setPhoneNumber(userData.telefono || "");
           if (userData.fotoPerfil) {
          setImagePreview(userData.fotoPerfil); // Cargar foto actual (URL)
        }
        }
      };
      fetchUserData();
    }
  }, [auth]);
const handlePhoneChange = (e) => {
  const valor = e.target.value;
  const regex = /^[0-9]*$/; // Solo números

  if (valor === "" || regex.test(valor)) {
    setPhoneNumber(valor);
  }
  // Si no es número, no actualiza el estado, bloquea el input
};
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

  const handleSubmit = async () => {
    const regex = /^[0-9]*$/;
  if (!regex.test(phoneNumber)) {
    alert("El número de teléfono solo puede contener dígitos numéricos.");
    return;
  }
    
    
    try {
      const user = auth.currentUser; // Obtener el usuario logueado
      let fotoPerfilURL = imagePreview; // Por defecto URL actual

    if (profileImage) {
      // Si hay nueva imagen, subir y obtener URL
      const { url } = await uploadToCloudinary(profileImage);
      fotoPerfilURL = url;
    }
      
      await updateProfile(user, {
        displayName: name // Actualiza el displayName
      });
      // Actualizar datos en Firestore
      const userRef = doc(db, "usuarios", user.uid);  // Referencia al documento del usuario
      const updatedData = {
        nombre: name,
        carrera: career,
        telefono: phoneNumber,
        // Si hay una nueva foto de perfil, se actualizaría
        fotoPerfil: fotoPerfilURL,  // Solo si se sube una imagen
      };

      // Usamos updateDoc para actualizar solo los campos modificados
      await updateDoc(userRef, updatedData); 

       const solicitudesRef = collection(db, "solicitudes");
    const q = query(
      solicitudesRef,
      where("estudiante_uid", "==", user.uid),
      where("estado", "==", "aceptado")
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      navigate("/studentHome"); // Tiene proyecto aprobado
    } else {
      navigate("/main"); // No tiene proyecto aprobado
    }
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
        <h2 style={styles.title}>Modificar Perfil de Estudiante</h2>

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
          <option value="Ingeniería en Sistemas Informáticos">
            Ingeniería en Sistemas Informáticos
          </option>
          <option value="Ingeniería Biomédica">Ingeniería Biomédica</option>
          <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
          <option value="Ingeniería de Telecomunicaciones">
            Ingeniería de Telecomunicaciones
          </option>
        </select>

        {/* Campo de teléfono */}
        <input
          style={styles.input}
          placeholder="Número de teléfono"
          value={phoneNumber}
          onChange={handlePhoneChange}
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

        {/* Botón de guardar */}
        <button style={styles.button} onClick={handleSubmit}>
          Guardar Perfil
        </button>
      </div>
      <BottomNav />
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

export default UpdateProfileStudent;