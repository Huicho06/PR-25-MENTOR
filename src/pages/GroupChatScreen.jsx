import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";
import Modal from "../components/GroupDetailsModal"; // Componente de navegación inferior
import { useLocation } from "react-router-dom";
import { db } from "/src/services/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { addDoc, serverTimestamp,doc, getDoc } from "firebase/firestore";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { writeBatch } from "firebase/firestore";
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



const GroupChatScreen = () => {
  
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

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((u) => {
    setUser(u);
  });
  return () => unsubscribe();
}, []);

useEffect(() => {
  if (!chatId || !user) return;
  const fetchChatName = async () => {
    //if (!chatId) return;
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
        setChatImage(data.fotoURL || null); // ← Aquí seteas la imagen de perfil
      }
    } else if (chat.tipo === "grupo_proyecto") {
      nombrePersonalizado = `Grupo: ${chat.nombre.split(":")[1]?.trim() || chat.nombre}`;
      setChatImage(null); // ← No mostramos imagen para grupo
    }

    setChatName(nombrePersonalizado);
  };

  fetchChatName();
}, [chatId, user]);

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
    alert("Grabación vacía, no se enviará.");
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
    alert("Error enviando audio.");
  }
};

      setIsRecording(true);

      // Timer que aumenta cada segundo
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    })
    .catch(err => {
      alert("No se pudo acceder al micrófono. Por favor revisa permisos.");
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

  const messagesEndRef = useRef(null);
  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messages]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  return (
    
    <div style={styles.wrapper}>
          {isGroupModalOpen && (
      <Modal onClose={() => setIsGroupModalOpen(false)} />
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
            <span onClick={() => setIsGroupModalOpen(true)} style={{ cursor: "pointer" }}>
              {chatName}
            </span>
         </div>
          <div style={{ position: "relative" }}>
  <FaEllipsisV
    style={styles.moreIcon}
    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
  />
  {isOptionsOpen && (
    <div style={styles.optionsModal}>
<div
  style={styles.optionItem1}
  onClick={() => {
    setIsSearchBarVisible(true);
    setIsOptionsOpen(false); // Oculta el menú
  }}
>
  <FaSearch style={styles.optionIcon} />
  <span>Buscar</span>
</div>

      <div style={styles.optionItem2}>
        <FaSignOutAlt style={styles.optionIcon} />
        <span>Salir del grupo</span>
      </div>
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
        {messages.map((msg, index) => {
          
          const isMe = msg.uid === getAuth().currentUser?.uid;
          const tipo = msg.archivoTipo?.toLowerCase() || "";
          const esAudio =
            msg.archivoUrl &&
            (tipo.includes("audio") || /\.(mp3|wav|ogg|webm)$/i.test(msg.archivoNombre));


          return (
            <div key={index} style={{
              ...styles.messageItem,
              alignSelf: isMe ? "flex-end" : "flex-start",
              backgroundColor: isMe ? "#1ed760" : "#1a1a1a",
              color: isMe ? "#000" : "#fff",
              padding: esAudio ? "2px 10px" : "10px 15px",  // menos padding vertical si es audio
              maxWidth: esAudio ? "300px" : "70%",  
            }}>
              {!isMe && <span style={styles.userName}>{msg.nombre || "Usuario"}</span>}
              
              {renderMessageContent(msg, isMe)}



              <div style={styles.timeAndStatus}>
                <span style={styles.time}>
                  {formatTimestamp(msg.timestamp)}
                </span>
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
  
  optionItem1: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #444",
    color: "#fff",
    fontSize: "0.95rem",
  },
  optionItem2: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    cursor: "pointer",
    borderBottom: "1px solid #444",
    color: "#fff",
    fontSize: "0.95rem",
  },
  
  optionIcon: {
    marginRight: "10px",
    color: "#1ed760",
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
