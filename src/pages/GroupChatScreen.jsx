import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip } from "react-icons/fa";
import { FaEllipsisV, FaSignOutAlt } from "react-icons/fa";
import Modal from "../components/GroupDetailsModal"; // Componente de navegación inferior

import {
  FaSearch,
  FaUser,
  FaCheck,
  FaCheckDouble,
  FaPaperPlane,
  FaMicrophone,
  FaTrash,
} from "react-icons/fa";

const currentUser = "You";

const GroupChatScreen = () => {
  const [messages, setMessages] = useState([
    { user: "Alex", message: "Hi, Good Evening 😊", time: "10:45" },
    { user: "Mary", message: "How was your Graphic Design Course Like? 😄", time: "12:45" },
    { user: "Professor J", message: "Hi, Morning too Mrs J", time: "15:29" },
    { user: "You", message: "I just finished the Sketch Basic 😎 ⭐⭐⭐⭐", time: "15:29", seen: true },
    { user: "You", message: "OMG, This is Amazing..", time: "13:59", seen: false },
  ]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef(); // <- para detectar clics fuera
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);
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
  
  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          user: currentUser,
          message: message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          seen: false,
        },
      ]);
      setMessage("");
    }
  };
  {showAttachmentOptions && (
    <div style={styles.attachmentModal}>
      <div style={styles.attachmentOption}>📷 Cámara</div>
      <div style={styles.attachmentOption}>🖼️ Fotos y videos</div>
      <div style={styles.attachmentOption}>📄 Documento</div>
    </div>
  )}
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
            <FaUser style={styles.icon} />
            <span onClick={() => setIsGroupModalOpen(true)} style={{ cursor: "pointer" }}>
  Alex, Mary, Professor J
</span>          </div>
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
          const isMe = msg.user === currentUser;
          return (
            <div
              key={index}
              style={{
                ...styles.messageItem,
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#1ed760" : "#1a1a1a",
              }}
            >
{!isMe && (
  <div>
    <span style={styles.userName}>{msg.user}</span>
    <div style={styles.messageText}>{msg.message}</div>
  </div>
)}
{isMe && (
  <div style={styles.messageText}>{msg.message}</div>
)}

              <div style={styles.timeAndStatus}>
                <span style={styles.time}>{msg.time}</span>
                {isMe && (
                  <span style={styles.checkIcon}>
                    {msg.seen ? <FaCheckDouble color="#4fc3f7" /> : <FaCheck color="#bbb" />}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

            {/* Input o grabación */} 
            <div style={styles.messageInputContainer}>
        {isRecording ? (
          <>
            <FaTrash
              onClick={() => {
                setIsRecording(false);
                setRecordingTime(0);
              }}
              style={styles.trashIcon}
            />
            <span style={styles.recordingDot}></span>
            <span style={styles.recordingTime}>
              0:{recordingTime.toString().padStart(2, "0")}
            </span>
            <div className="wave-animation" style={styles.waveBars}></div>
            <button
              onClick={() => {
                alert("Audio enviado");
                setIsRecording(false);
                setRecordingTime(0);
              }}
              style={styles.circleButton}
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
              type="text"
              placeholder="Escribe un mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={styles.messageInput}
            />
            <button
              onClick={message.trim() ? handleSendMessage : () => {
                setIsRecording(true);
                setShowAttachmentOptions(false);
              }}
              style={styles.circleButton}
            >
              {message.trim() ? <FaPaperPlane size={18} /> : <FaMicrophone size={18} />}
            </button>
          </>
        )}
      </div>

      {/* Modal de adjuntos (MOVER AQUÍ) */}
      {showAttachmentOptions && !isRecording && (
        <div style={styles.attachmentModal}>
          <div style={styles.attachmentOption}>📷 Cámara</div>
          <div style={styles.attachmentOption}>🖼️ Fotos y videos</div>
          <div style={styles.attachmentOption}>📄 Documento</div>
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
    position: "absolute",
    bottom: "70px",
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
