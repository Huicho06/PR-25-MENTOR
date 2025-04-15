import { db } from "./firebase";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

export const crearSolicitudRecuperacion = async (correo, codigo) => {
  const docId = correo.replace(/\./g, "_"); 

  await setDoc(doc(db, "recuperaciones", docId), {
    correo,
    codigo,
    expiracion: new Date(Date.now() + 15 * 60 * 1000),
    creado: serverTimestamp(),
  });
};


export const generarCodigoRecuperacion = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); 
  };
  