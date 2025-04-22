import React, { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda
import { FiMessageCircle } from "react-icons/fi"; // Icono de mensaje
import BottomNav from "../components/BottomNav"; // Para la barra de navegación
import Navbar from "../components/Navbar"; // Para la barra de navegación
import MainNavbar from "../components/MainNavbar"; // Para la barra de navegación

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { user: "Natasha", message: "Hi, Good Evening Bro..!", time: "14:59", unread: 3, avatar: "https://placeimg.com/100/100/people" },
    { user: "Mary J", message: "How was your Graphic de..!", time: "06:35", unread: 2, avatar: "https://placeimg.com/100/100/people" },
    { user: "John", message: "How are you?", time: "08:10", unread: 0, avatar: "https://placeimg.com/100/100/people" },
    { user: "Mia", message: "OMG, This is Amazing..", time: "21:07", unread: 5, avatar: "https://placeimg.com/100/100/people" },
    { user: "Maria", message: "Wow, This is Really Epic", time: "09:15", unread: 0, avatar: "https://placeimg.com/100/100/people" },
    { user: "Tiya", message: "Hi, Good Evening Bro..!", time: "14:59", unread: 3, avatar: "https://placeimg.com/100/100/people" },
  ]);

  const [activeTab, setActiveTab] = useState("chat"); // Estado para manejar qué botón está activo
  const [searchTerm, setSearchTerm] = useState(""); // Para la barra de búsqueda

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para cambiar el estado del botón activo
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <Navbar />
      {/* Listado de mensajes */}
      <div style={styles.messageList}>
        {messages
          .filter((message) => message.user.toLowerCase().includes(searchTerm.toLowerCase())) // Filtra por búsqueda
          .map((message, index) => (
            <div key={index} style={styles.messageItem}>
              <div style={styles.userInfo}>
                <img src={message.avatar} alt={message.user} style={styles.userIcon} />
                <div>
                  <h3 style={styles.userName}>{message.user}</h3>
                  <p style={styles.messageText}>{message.message}</p>
                </div>
              </div>
              <div style={styles.messageDetails}>
                <span style={styles.time}>{message.time}</span>
                {message.unread > 0 && (
                  <div style={styles.unreadBadge}>
                    <span>{message.unread}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
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
    flexDirection: "column",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #333",
  },
  backButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatTasksBtns: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "20px",
  },
  chatBtn: {
    backgroundColor: "#333", // Fondo gris para Chat
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
  },
  chatBtnActive: {
    backgroundColor: "#1ed760", // Verde para Chat activo
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "bold",
  },
  tasksBtn: {
    backgroundColor: "#333", // Fondo gris para Tareas
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tasksBtnActive: {
    backgroundColor: "#1ed760", // Verde para Tareas activo
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "30px",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  searchInput: {
    width: "90%",
    padding: "10px",
    borderRadius: "15px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    textAlign: "center",
  },
  messageList: {
    marginTop: "20px",
    overflowY: "auto",
    height: "calc(100vh - 150px)", // Ajustar la altura del scroll
  },
  messageItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    backgroundColor: "#1a1a1a",
    marginBottom: "10px",
    borderRadius: "10px",
    color: "#fff",
  },
  userInfo: {
    display: "flex",
    gap: "10px",
  },
  userIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover", // Asegura que la imagen sea circular
  },
  userName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  messageText: {
    fontSize: "1rem",
    color: "#ccc",
    marginTop: "5px",
  },
  messageDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  time: {
    fontSize: "0.9rem",
    color: "#ccc",
  },
  unreadBadge: {
    backgroundColor: "#f44336",
    color: "#fff",
    borderRadius: "50%",
    padding: "5px 10px",
    fontSize: "0.9rem",
    marginTop: "5px",
  },
};

export default ChatScreen;
