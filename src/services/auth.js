import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "./firebase";  

const auth = getAuth(app); 


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
  const credenciales = await createUserWithEmailAndPassword(auth, email, password);
  const user = credenciales.user;

  
  const baseData = {
    nombre,
    correo: email,
    tipo,
    ...datosAdicionales,
  };

  await setDoc(doc(db, "usuarios", user.uid), baseData);
  return user;
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
