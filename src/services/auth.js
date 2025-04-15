import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

//import { getAuth, sendPasswordResetEmail } from "firebase/auth";
//import { app } from "./firebase";  




export const enviarCorreoRecuperacion = async (correo) => {
  try {

    await sendPasswordResetEmail(auth, correo);
    console.log("Correo de recuperación enviado a:", correo);
  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error.message);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
};


export const registrarUsuario = async (email, password, nombre, tipo, datosAdicionales = {}) => {
  const auth = getAuth();

  try {
    // Verificar si el email ya está en uso
    const credenciales = await createUserWithEmailAndPassword(auth, email, password);
    const user = credenciales.user;

    const docId = email.replace(/\./g, "_");

    const baseData = {
      nombre,
      correo: email,
      tipo,
      ...datosAdicionales,
    };

    // Guardar los datos en Firestore
    await setDoc(doc(db, "usuarios", docId), baseData);
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('El correo electrónico ya está registrado');
    } else {
      throw new Error('Ocurrió un error al registrar el usuario');
    }
  }
};

// LOGIN
export const iniciarSesion = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// LOGOUT
export const cerrarSesion = () => {
  return signOut(auth);
};

// OBSERVADOR DE SESIÓN
export const observarUsuario = (callback) => {
  return onAuthStateChanged(auth, callback);
};
