import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";
import Modal from "../components/GroupDetailsModal"; // Componente de navegación inferior
import { useLocation } from "react-router-dom";
import { db } from "/src/services/firebase";
import { getAuth } from "firebase/auth";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { useParams } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaCheck,
  FaCheckDouble,
  FaPaperPlane,
  FaMicrophone,
  FaTrash,
} from "react-icons/fa";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDocs,
  getDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";
import ImageModule from "docxtemplater-image-module-free";


const GroupChatScreen = () => {
  const [solicitudData, setSolicitudData] = useState(null);

  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const location = useLocation();
  const { chatId } = useParams();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef(); // <- para detectar clics fuera
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const mediaRecorderRef = useRef(null);
const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const [chatImage, setChatImage] = useState(null);
  const [chatName, setChatName] = useState("Chat");
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const shouldSendAudioRef = useRef(false);
const [firmaURL, setFirmaURL] = useState(null);
const [firmaConUrl, setFirmaConUrl] = useState(null); // Este es nuevo

  const [isTeacher, setIsTeacher] = useState(false);
const [progress, setProgress] = useState(0);
const [showProgressModal, setShowProgressModal] = useState(false);
const [isOptionsOpen, setIsOptionsOpen] = useState(false);
const [showProgressViewModal, setShowProgressViewModal] = useState(false);
const [showDownloadModal, setShowDownloadModal] = useState(false);
const [documentUrl, setDocumentUrl] = useState(null);
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (u) => {
    setUser(u);
    if (u) {
      const userDocRef = doc(db, "usuarios", u.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setIsTeacher(userSnap.data().tipo === "teacher");
      }
    }
  });
  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!chatId) return;
  const progRef = doc(db, "chats", chatId, "meta", "progreso");
  const unsubscribe = onSnapshot(progRef, (docSnap) => {
    if (docSnap.exists()) {
      setProgress(docSnap.data().value || 0);
    }
  });
  return () => unsubscribe();
}, [chatId]);

useEffect(() => {
  if (!chatId || !user) return;
  const fetchChatName = async () => {
  if (!chatId || !user) return;

  const ref = doc(db, "chats", chatId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const chat = snap.data();
  let nombrePersonalizado = chat.nombre;

  if (chat.tipo === "personal") {
    const userRef = doc(db, "usuarios", user.uid);
    const userSnap = await getDoc(userRef);
    const nombre = userSnap.exists() ? userSnap.data().nombre : "Tú";
    nombrePersonalizado = `${nombre} (Tú)`;
  } else if (chat.tipo === "compañero" || chat.tipo === "tutor_estudiante") {
    const otroUID = chat.participantes.find(uid => uid !== user.uid);
    const otroRef = doc(db, "usuarios", otroUID);
    const otroSnap = await getDoc(otroRef);
    if (otroSnap.exists()) {
      const data = otroSnap.data();
      nombrePersonalizado = data.nombre || "Usuario";
      setChatImage(data.fotoURL || null);
    }
  } else if (chat.tipo === "grupo_proyecto") {
    nombrePersonalizado = `Grupo: ${chat.nombre.split(":")[1]?.trim() || chat.nombre}`;
    setChatImage(null);
  }

  setChatName(nombrePersonalizado);
};



  fetchChatName();
}, [chatId, user]);
const fetchDocumentUrl = async () => {
  if (!chatId) return;
  const docRef = doc(db, "chats", chatId, "meta", "documento");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    setDocumentUrl(docSnap.data().url);
  } else {
    setDocumentUrl(null);
  }
};
const handleOpenDownloadModal = async () => {
  await fetchDocumentUrl();
  setShowDownloadModal(true);
};
const saveProgress = async (newProgress) => {
  if (!chatId) return;
  const progRef = doc(db, "chats", chatId, "meta", "progreso");
  try {
    await setDoc(progRef, { value: newProgress });
    setShowProgressModal(false);
  } catch (error) {
    console.error("Error guardando progreso:", error);
    alert("Error guardando progreso");
  }
};

const startRecording = () => {
  shouldSendAudioRef.current = true;
  setRecordingTime(0);
  audioChunksRef.current = [];

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (!shouldSendAudioRef.current) {
  // No enviar, solo limpiar y salir
  audioChunksRef.current = [];
  return;
}

  stream.getTracks().forEach(track => track.stop());

  const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
  
  if (audioBlob.size === 0) {
    return;
  }

  const file = new File([audioBlob], `audio_${Date.now()}.webm`, { type: "audio/webm" });

  try {
    const { url, type, name } = await uploadToCloudinary(file);
    
    if (!user) return;

    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const nombre = userDocSnap.exists() ? userDocSnap.data().nombre : "Usuario";

    await addDoc(collection(db, "chats", chatId, "mensajes"), {
      texto: "",
      archivoUrl: url,
      archivoTipo: type,
      archivoNombre: name,
      uid: user.uid,
      nombre: nombre,
      timestamp: serverTimestamp(),
      visto: false
    });
  } catch (error) {
    console.error("Error enviando audio:", error);
  }
};

      setIsRecording(true);

      // Timer que aumenta cada segundo
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    })
    .catch(err => {
      console.error(err);
    });
};


  // Detiene la grabación y dispara el evento onstop
  const stopRecording = () => {
  if (!mediaRecorderRef.current) return;

  mediaRecorderRef.current.stop();

  clearInterval(recordingTimerRef.current);

  setIsRecording(false);
  setRecordingTime(0);
};


  const cancelRecording = () => {
  shouldSendAudioRef.current = false;

  if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
    mediaRecorderRef.current.stop();
  }

  clearInterval(recordingTimerRef.current);
  setIsRecording(false);
  setRecordingTime(0);
  audioChunksRef.current = [];
};
const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { url, type, name } = await uploadToCloudinary(file);

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    const nombre = userDocSnap.exists() ? userDocSnap.data().nombre : "Usuario";

    await addDoc(collection(db, "chats", chatId, "mensajes"), {
      texto: "",
      archivoUrl: url,
      archivoTipo: type,
      archivoNombre: name,
      uid: user.uid,
      nombre: nombre,
      timestamp: serverTimestamp(),
    });
  };
const getBase64FromUrl = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // <- esto será data:image/png;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const handleGenerateDocument = async () => {
  try {
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    // 1. Buscar la solicitud aprobada del estudiante
    const q = query(
      collection(db, "solicitudes"),
      where("estudiante_uid", "==", user.uid),
      where("estado", "==", "aceptado")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("No se encontró solicitud aprobada para este estudiante.");
      return;
    }
    const solicitudDoc = querySnapshot.docs[0];
    const solicitudData = solicitudDoc.data();
    const integrantes = solicitudData.proyecto_integrantes || [];

    // 2. Obtener datos del tutor y su firma
    const tutorUid = solicitudData.tutor_uid;
    const tutorRef = doc(db, "usuarios", tutorUid);
    const tutorSnap = await getDoc(tutorRef);

    let nombreTutor = "Tutor";
    let firmaURL = null;

    if (tutorSnap.exists()) {
      const tutorData = tutorSnap.data();
      nombreTutor = tutorData.nombre || nombreTutor;
      firmaURL = tutorData.firma || null;
      setFirmaURL(firmaURL);
    }

    // 3. Formatear texto integrantes
    let textoEstudiantes = "Estudiante";
    if (integrantes.length === 1) {
      textoEstudiantes = integrantes[0];
    } else if (integrantes.length === 2) {
      textoEstudiantes = `${integrantes[0]} y ${integrantes[1]}`;
    } else if (integrantes.length > 2) {
      const ultimos = integrantes.pop();
      textoEstudiantes = `${integrantes.join(", ")} y ${ultimos}`;
      integrantes.push(ultimos);
    }
    const palabraEstudiante = integrantes.length > 1 ? "los estudiantes" : "el estudiante";

    // 4. Datos del proyecto
    const tituloProyecto = solicitudData.proyecto_nombre || chatName || "Proyecto";

    // 5. Carga plantilla .docx
    const response = await fetch("/plantillas/carta_aprobacion.docx");
    const content = await response.arrayBuffer();

    // 6. Instancia módulo imagen para documento SIN firma
    const imageModuleSinFirma = new ImageModule({
      centered: false,
      getImage: function(tagValue) {
        const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, "");
        return Buffer.from(base64Data, "base64");
      },
      getSize: function() {
        return [150, 50];
      }
    });

    const zipSinFirma = new PizZip(content);
const docSinFirma = new Docxtemplater(zipSinFirma, {
  paragraphLoop: true,
  linebreaks: true,
  modules: [imageModuleSinFirma],
  delimiters: { start: "{", end: "}" }  // <-- AÑADIR ESTO
});


    docSinFirma.render({
FECHA: new Date().toLocaleString(),
      NOMBRE_DEL_ESTUDIANTE: textoEstudiantes,
      TITULO_DEL_PROYECTO: tituloProyecto,
      NOMBRE_DEL_TUTOR: nombreTutor,
      ARTICULO_ESTUDIANTE: palabraEstudiante,
      FIRMA: "", // Sin firma en este documento
    });
const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");

    const blobSinFirma = docSinFirma.getZip().generate({ type: "blob" });
const fileSinFirma = new File([blobSinFirma], `carta_sin_firma_${timestamp}.docx`, {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

if (firmaURL) {

  const imageModuleConFirma = new ImageModule({
    centered: false,
    getImage(tagValue) {
      const base64Data = tagValue.replace(/^data:image\/\w+;base64,/, "");
      return Buffer.from(base64Data, "base64");
    },
    getSize() {
      return [150, 50];
    },
  });

  const zipConFirma = new PizZip(content);
  const docConFirma = new Docxtemplater(zipConFirma, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [imageModuleConFirma],
    delimiters: { start: "{", end: "}" }
  });
const base64Firma = await getBase64FromUrl(firmaURL);

docConFirma.render({
  FECHA: new Date().toLocaleDateString(),
  NOMBRE_DEL_ESTUDIANTE: textoEstudiantes,
  TITULO_DEL_PROYECTO: tituloProyecto,
  NOMBRE_DEL_TUTOR: nombreTutor,
  ARTICULO_ESTUDIANTE: palabraEstudiante,
  FIRMA: base64Firma // <-- debe empezar con "data:image/png;base64,..."
});


  const blobConFirma = docConFirma.getZip().generate({ type: "blob" });
  const fileConFirma = new File([blobConFirma], `carta_${timestamp}.docx`, {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  const { url: urlConFirma } = await uploadToCloudinary(fileConFirma);
  await setDoc(doc(db, "chats", chatId, "meta", "Documento de Aprobación"), {
    url: urlConFirma,
    nombre: `carta__${timestamp}.docx`,
    generadoEn: new Date().toISOString(),
  });

  setFirmaConUrl(urlConFirma);
}




  } catch (error) {

  }
};


  const photosInputRef = useRef(null);
  const docsInputRef = useRef(null);  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchBarVisible &&
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setIsSearchBarVisible(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchBarVisible]);

  const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();

  if (isSameDay) {
    // Solo hora
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    // Fecha corta (puedes cambiar el formato)
    return date.toLocaleDateString();
  }
};
  const renderMessageContent = (msg, isMe) => {
  if (msg.archivoUrl) {
    const tipo = msg.archivoTipo?.toLowerCase() || "";
      // Detectar imagen por tipo o extensión
    const esImagen = tipo.includes("image") || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(msg.archivoNombre);
    // Detectar video por tipo o extensión
    const esVideo = tipo.includes("video") || /\.(mp4|mov|avi|wmv|flv)$/i.test(msg.archivoNombre);
    const esAudio = /\.(mp3|wav|ogg|webm)$/i.test(msg.archivoNombre || "");

    // Cambia estas condiciones para que coincidan con tu archivoTipo exacto
    if (esImagen) {
      return (
        <>
          <a href={msg.archivoUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={msg.archivoUrl}
              alt={msg.archivoNombre || "Imagen enviada"}
              style={{ maxWidth: "200px", borderRadius: "10px", marginTop: "8px" }}
            />
          </a>
          <div style={{ fontSize: "0.85rem", color: isMe ? "#000" : "#ccc", marginTop: "4px" ,fontWeight: "bold"}}>
            {msg.archivoNombre}
          </div>
        </>
      );
     } else if (esVideo) {
      return (
        <>
        <a href={msg.archivoUrl} target="_blank" rel="noopener noreferrer">
          <video
            controls
            src={msg.archivoUrl}
            alt={msg.archivoNombre || "Video enviado"}
            style={{ maxWidth: "200px", borderRadius: "10px", marginTop: "8px" }}
          />
          </a>
          <div style={{ fontSize: "0.85rem", color: isMe ? "#000" : "#ccc", marginTop: "4px",fontWeight: "bold" }}>
            {msg.archivoNombre}
          </div>
        </>
      );
      } else if (msg.archivoNombre?.endsWith(".pdf")) {
      // PDF directo
      return (
        <a
          href={msg.archivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", color: isMe ? "#000" : "#1ed760", fontWeight: "bold", marginTop: "8px", textDecoration: "none" }}
        >
          <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>📄</span>
          <span>{msg.archivoNombre || "Archivo adjunto"}</span>
        </a>
      );
    } else if (msg.archivoNombre?.match(/\.(doc|docx)$/i)) {
      // Word online viewer
      const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(msg.archivoUrl)}`;
      return (
        <a
          href={officeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", color: isMe ? "#000" : "#1ed760", fontWeight: "bold", marginTop: "8px", textDecoration: "none" }}
        >
          <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>📄</span>
          <span>{msg.archivoNombre || "Archivo adjunto"}</span>
        </a>
      );
    }else if (esAudio) {
      return (
        <>
          <a href={msg.archivoUrl} target="_blank" rel="noopener noreferrer">
            <audio
              controls
              src={msg.archivoUrl}
              style={{
                width: "100%",       // que ocupe todo el ancho posible de la burbuja
                maxWidth: "280px",   // límite máximo más ancho que antes
                height: "24px",      // un poco menos alto para que se vea más compacto
                marginTop: "8px",
                marginBottom: "0",
                verticalAlign: "middle",
                borderRadius: "8px"
              }}
            />
          </a>
          <div
            style={{
              fontSize: "0.85rem",
              color: isMe ? "#000" : "#ccc",
              marginTop: "1px",
              fontWeight: "bold",
              maxWidth: "280px",
              overflowWrap: "break-word",
              wordBreak: "break-word",
            }}
          >
            {msg.archivoNombre}
          </div>
        </>
      );
    } else {
      return (
        <a
          href={msg.archivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: isMe ? "#000" : "#1ed760",
              fontWeight: "bold",
              marginTop: "8px",
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: "1.2rem", marginRight: "8px" }}>📄</div>
            <div>{msg.archivoNombre || "Archivo adjunto"}</div>
          </div>
        </a>
      );
    }
  } else {
    return <div style={styles.messageText}>{msg.texto}</div>;
  }
};
const filteredMessages = messages.filter(msg => {
  const texto = msg.texto?.toLowerCase() || "";
  const archivoNombre = msg.archivoNombre?.toLowerCase() || "";
  const query = searchQuery.toLowerCase();

  return texto.includes(query) || archivoNombre.includes(query);
});

  useEffect(() => {
  if (!chatId || !user) return;

  //const auth = getAuth();
  //const user = auth.currentUser;
  //if (!user) return;

  const q = query(
    collection(db, "chats", chatId, "mensajes"),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setMessages(msgs);

    const batch = writeBatch(db);
    let hasUpdates = false;

    msgs.forEach((msg) => {
      if (!msg.visto && msg.uid !== user.uid) {
        const msgRef = doc(db, "chats", chatId, "mensajes", msg.id);
        batch.update(msgRef, { visto: true });
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      await batch.commit();
    }
  });
  return () => unsubscribe();
}, [chatId,user]);

  const handleSendMessage = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!message.trim() || !user) return;

  // Traer nombre del usuario desde Firestore
  const userDocRef = doc(db, "usuarios", user.uid);
  const userDocSnap = await getDoc(userDocRef);
  const userData = userDocSnap.exists() ? userDocSnap.data() : null;
  const nombre = userData?.nombre || "Usuario";

  await addDoc(collection(db, "chats", chatId, "mensajes"), {
    texto: message.trim(),
    uid: user.uid,
    nombre: nombre,
    timestamp: serverTimestamp(),
    visto: false 
  });

  setMessage("");
};
<div
  style={{
    position: "fixed",
    bottom: "60px",
    width: "90%",
    maxWidth: "600px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    borderRadius: "10px",
    padding: "10px",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    zIndex: 1000,
  }}
>
  Progreso del proyecto: {progress}%
  <div
    style={{
      height: "8px",
      backgroundColor: "#1ed760",
      width: `${progress}%`,
      borderRadius: "4px",
      marginTop: "6px",
      transition: "width 0.3s ease-in-out",
    }}
  />
</div>

  const messagesEndRef = useRef(null);
  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);

  return (
    
    <div style={styles.wrapper}>
      {showProgressViewModal && (
  <div
    style={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1a1a1a",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 2000,
      color: "#fff",
      width: "300px",
      textAlign: "center",
    }}
  >
    <h3>Progreso del proyecto</h3>
    <div
      style={{
        height: "20px",
        backgroundColor: "#333",
        borderRadius: "10px",
        marginTop: "15px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: "#1ed760",
          width: `${progress}%`,
          borderRadius: "10px",
          transition: "width 0.3s ease-in-out",
        }}
      />
    </div>
    <p style={{ marginTop: "10px", fontWeight: "bold" }}>{progress}%</p>
    <button onClick={() => setShowProgressViewModal(false)}>Cerrar</button>
  </div>
)}

      {showProgressModal && (
  <div
    style={{
      position: "fixed",
      top: "30%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#1a1a1a",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 2000,
      color: "#fff",
    }}
  >
    <h3>Modificar progreso del proyecto</h3>
    <input
      type="range"
      min={0}
      max={100}
      value={progress}
      onChange={(e) => setProgress(Number(e.target.value))}
      style={{ width: "100%" }}
    />
    <p>{progress}%</p>
    <button onClick={() => saveProgress(progress)}>Guardar</button>
    <button onClick={() => setShowProgressModal(false)}>Cerrar</button>
  </div>
)}

{isGroupModalOpen && (
  <Modal
    onClose={() => setIsGroupModalOpen(false)}
    chatId={chatId}
    currentUserId={user?.uid}
/>
)}
      {/* Header fijo */}
      <div style={styles.topBar}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {chatImage ? (
              <img src={chatImage} alt="avatar" style={styles.chatAvatar} />
            ) : (
              <FaUser style={styles.icon} />
            )}
<span
              onClick={() => {
                if (chatName.startsWith("Grupo:")) {
                  setIsGroupModalOpen(true);
                }
              }}
              style={{ cursor: "pointer" }}
            >              {chatName}
            </span>
         </div>
          <div style={{ position: "relative" }}>
  <FaEllipsisV
    style={styles.moreIcon}
    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
  />


{/* Menú desplegable de opciones */}
{isOptionsOpen && (
  <div style={styles.optionsModal}>
    <div
      style={styles.optionItem}
      onClick={() => {
        setIsSearchBarVisible(true);
        setIsOptionsOpen(false);
      }}
    >
      <FaSearch style={styles.optionIcon} />
      <span>Buscar</span>
    </div>

    {isTeacher ? (
      <div
        style={styles.optionItem}
        onClick={() => {
          setShowProgressModal(true);
          setIsOptionsOpen(false);
        }}
      >
        📊 Modificar barra de progreso
      </div>
    ) : (
      <div
        style={styles.optionItem}
        onClick={() => {
          setShowProgressViewModal(true);
          setIsOptionsOpen(false);
        }}
      >
        📊 Ver progreso
      </div>
    )}

    {!isTeacher && progress === 100 && (
      <div
        style={styles.optionItem}
onClick={async () => {
  await handleGenerateDocument();  // <- generar el documento
  handleOpenDownloadModal();       // <- mostrar el modal después
  setIsOptionsOpen(false);
}}

      >
        📄 Generar documento
      </div>
    )}

  </div>
)}

{/* Modal de descarga documento */}
{showDownloadModal && (
  <div style={modalStyles}>
    <h3>Documento generado</h3>

    {documentUrl && (
      <a href={documentUrl} target="_blank" rel="noopener noreferrer" download>
        <button style={styles.downloadButton}>Descargar documento</button>
      </a>
    )}

    {firmaConUrl && (
      <a href={firmaConUrl} target="_blank" rel="noopener noreferrer" download>
        <button style={styles.downloadButton}>Descargar documento</button>
      </a>
    )}

    <button style={styles.closeButton} onClick={() => setShowDownloadModal(false)}>Cerrar</button>
  </div>
)}


</div>

        </div>
      </div>

      {/* Lista de mensajes */}
      {isSearchBarVisible && (
  <div style={styles.searchOverlay} ref={searchBarRef}>
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Buscar mensajes..."
      style={styles.searchInputOverlay}
    />
  </div>
)}



      <div style={styles.messageList}>
  {filteredMessages.map((msg, index) => {
    const isMe = msg.uid === getAuth().currentUser?.uid;
    const tipo = msg.archivoTipo?.toLowerCase() || "";
    const esAudio =
      msg.archivoUrl &&
      (tipo.includes("audio") || /\.(mp3|wav|ogg|webm)$/i.test(msg.archivoNombre));

    return (
      <div
        key={index}
        style={{
          ...styles.messageItem,
          alignSelf: isMe ? "flex-end" : "flex-start",
          backgroundColor: isMe ? "#1ed760" : "#1a1a1a",
          color: isMe ? "#000" : "#fff",
          padding: esAudio ? "2px 10px" : "10px 15px",
          maxWidth: esAudio ? "300px" : "70%",
        }}
      >
        {!isMe && <span style={styles.userName}>{msg.nombre || "Usuario"}</span>}
        {renderMessageContent(msg, isMe)}

        <div style={styles.timeAndStatus}>
          <span style={styles.time}>{formatTimestamp(msg.timestamp)}</span>
          {isMe && <FaCheckDouble color="#4fc3f7" />}
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef} />
</div>

            {/* Input o grabación */} 
            <div style={styles.messageInputContainer}>
                {isRecording ? (
            <>
            <FaTrash
              onClick={cancelRecording}
              style={styles.trashIcon}
              title="Cancelar grabación"
            />
            <span style={styles.recordingDot}></span>
            <span style={styles.recordingTime}>
              0:{recordingTime.toString().padStart(2, "0")}
            </span>

            <div className="wave-animation" style={styles.waveBars}></div>
            <button
              onClick={stopRecording}
              style={styles.circleButton}
              title="Enviar audio"
            >
              <FaPaperPlane size={18} />
            </button>
          </>
        ) : (
          <>
            <FaPaperclip
              onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
              style={styles.attachIcon}
            />
            <input
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              ref={photosInputRef}
              onChange={handleFileChange}
            />

            <input
              type="file"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: "none" }}
              ref={docsInputRef}
              onChange={handleFileChange}
            />
            <input
              type="text"
              placeholder="Escribe un mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && message.trim()) {
                  e.preventDefault(); // para evitar salto de línea si no quieres
                  handleSendMessage();
                }
              }}
              style={styles.messageInput}
            />
            <button
              onClick={message.trim() ? handleSendMessage : startRecording}
              style={styles.circleButton}
              title={message.trim() ? "Enviar mensaje" : "Grabar audio"}
            >
              {message.trim() ? <FaPaperPlane size={18} /> : <FaMicrophone size={18} />}
            </button>
          </>
        )}
      </div>

      {/* Modal de adjuntos (MOVER AQUÍ) */}
      {showAttachmentOptions && !isRecording && (
        <div style={styles.attachmentModal}>
          {/*<div style={styles.attachmentOption}>📷 Cámara</div>*/}
          <div
            style={styles.attachmentOption}
            onClick={() => {
              photosInputRef.current?.click();
              setShowAttachmentOptions(false);
            }}
          >
            🖼️ Fotos y videos
          </div>
          <div
            style={styles.attachmentOption}
            onClick={() => {
              docsInputRef.current?.click();
              setShowAttachmentOptions(false);
            }}
          >
            📄 Documento
          </div>
        </div>
      )}

    </div>
  );
};
const modalStyles = {
  position: "fixed",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#1a1a1a",
  padding: "20px",
  borderRadius: "10px",
  zIndex: 2000,
  color: "#fff",
  width: "300px",
  textAlign: "center",
};
const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    paddingTop: "70px",
    paddingBottom: "70px",
  },
  searchOverlay: {
    position: "absolute",
    top: "70px", // justo debajo del topBar
    left: "0",
    width: "100%",
    backgroundColor: "#1a1a1a",
    padding: "10px 20px",
    zIndex: 1000,
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  },
  chatAvatar: {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px",
},
  searchInputOverlay: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #555",
    fontSize: "1rem",
  },  
  moreIcon: {
    fontSize: "18px",
    color: "#fff",
    cursor: "pointer",
  },
  
  optionsModal: {
    position: "absolute",
    top: "30px",
    right: 0,
    backgroundColor: "#2a2a2a",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.6)",
    zIndex: 1000,
    width: "160px",
  },
  
optionItem: {
  display: "flex",
  alignItems: "center",
  padding: "10px 15px",
  cursor: "pointer",
  borderBottom: "1px solid #444",
  color: "#fff",
  fontSize: "0.95rem",
  transition: "background-color 0.2s ease",
},
optionItemExit: {
  display: "flex",
  alignItems: "center",
  padding: "10px 15px",
  cursor: "pointer",
  color: "#ff4d4d",
  fontWeight: "bold",
  fontSize: "0.95rem",
  borderTop: "1px solid #444",
  marginTop: "8px",
},
optionItemHover: {
  backgroundColor: "#333",
},
optionIcon: {
  marginRight: "10px",
  color: "#1ed760",
  minWidth: "18px",
  textAlign: "center",
},
downloadButton: {
  backgroundColor: "#1ed760",
  color: "#000",
  fontWeight: "bold",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
  margin: "8px 0",
  width: "100%",
  fontSize: "1rem",
  transition: "background-color 0.3s ease",
},
closeButton: {
  backgroundColor: "#444",
  color: "#fff",
  fontWeight: "bold",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
  marginTop: "10px",
  width: "100%",
  fontSize: "1rem",
},
  attachIcon: {
    fontSize: "20px",
    color: "#fff",
    marginRight: "10px",
    cursor: "pointer",
  },
  
  attachmentModal: {
    position: "fixed",
    bottom: "80px",
    left: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    zIndex: 1001,
  },
  
  attachmentOption: {
    color: "#fff",
    padding: "8px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #333",
  },
  
  topBar: {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
    backgroundColor: "#0a0a0a",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    borderBottom: "1px solid #333",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "#1ed760",
  },
  searchIcon: {
    fontSize: "18px",
    color: "#fff",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
  },
  messageItem: {
    maxWidth: "70%",
    padding: "10px 15px",
    borderRadius: "15px",
    marginBottom: "10px",
    color: "#fff",
  },
  userName: {
    fontWeight: "bold",
    color: "#1ed760",
    fontSize: "0.9rem",
    marginBottom: "4px",
    display: "block", // esto asegura que quede encima del mensaje
  },
  
  messageText: {
    fontSize: "1rem",
    wordWrap: "break-word",
    whiteSpace: "pre-wrap", // <-- esta es la clave
    overflowWrap: "break-word", // por compatibilidad
    maxWidth: "100%", // para que no se estire fuera del bubble
  },
  
  timeAndStatus: {
    fontSize: "0.8rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "5px",
    gap: "5px",
  },
  messageInputContainer: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    padding: "12px 20px",
    zIndex: 1000,
  },
  messageInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "20px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    fontSize: "1rem",
    marginRight: "10px",
  },
  circleButton: {
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  trashIcon: {
    fontSize: "1.3rem",
    color: "#bbb",
    marginRight: "10px",
    cursor: "pointer",
  },
  recordingDot: {
    width: "10px",
    height: "10px",
    backgroundColor: "red",
    borderRadius: "50%",
    marginRight: "10px",
  },
  recordingTime: {
    fontSize: "1rem",
    color: "#fff",
    marginRight: "10px",
  },
  waveBars: {
    width: "40px",
    height: "12px",
    background: "repeating-linear-gradient(90deg, #ccc 0 2px, transparent 2px 4px)",
    animation: "pulse 1s infinite",
    marginRight: "auto",
  },
};

export default GroupChatScreen;
