import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// REGISTRO: Se le puede pasar info personalizada para estudiantes o tutores
export const registrarUsuario = async (email, password, nombre, tipo, datosAdicionales = {}) => {
  const credenciales = await createUserWithEmailAndPassword(auth, email, password);
  const user = credenciales.user;

  // Construir objeto final
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
