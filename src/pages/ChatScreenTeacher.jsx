import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para la navegación
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda
import { FiMessageCircle } from "react-icons/fi"; // Icono de mensaje
import BottomNavTeacher from "../components/BottomNavTeacher"; // Para la barra de navegación
import NavbarT from "../components/NavbarTeacher"; // Para la barra de navegación
import MainNavbar from "../components/MainNavbar"; // Para la barra de navegación
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "/src/services/firebase";
import { doc, getDoc } from "firebase/firestore";

const getUserInfoByUID = async (uid) => {
  const docSnap = await getDoc(doc(db, "usuarios", uid));
  if (docSnap.exists()) return docSnap.data();
  return { nombre: "Usuario", foto: null };
};

const ChatScreenTeacher = () => {
  const [allChats, setAllChats] = useState([]);       // TODOS los chats
  const [visibleChats, setVisibleChats] = useState([]); // Chats que se muestran
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat"); // Estado para manejar qué botón está activo
 // Hook para la navegación

 useEffect(() => {
    const fetchChats = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "chats"),
        where("participantes", "array-contains", user.uid)
      );
       const snapshot = await getDocs(q);
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const personalizedChats = await Promise.all(chatList.map(async (chat) => {
        let nombrePersonalizado = chat.nombre;
        let fotoPerfil = null;

        if (chat.tipo === "personal" || chat.tipo === "tutor_estudiante") {
          const otroUID = chat.participantes.find(uid => uid !== user.uid);
          const otro = await getUserInfoByUID(otroUID);
          nombrePersonalizado = otro.nombre || "Usuario";
          fotoPerfil = otro.foto || null;
        } else if (chat.tipo === "grupo_proyecto") {
          nombrePersonalizado = `Grupo: ${chat.nombre.split(":")[1]?.trim() || chat.nombre}`;
          fotoPerfil = null;
        }
        const mensajesRef = collection(db, "chats", chat.id, "mensajes");
        const qNoLeidos = query(
          mensajesRef,
          where("visto", "==", false),
          where("uid", "!=", user.uid)
        );
        const snapshotNoLeidos = await getDocs(qNoLeidos);
        const noLeidosCount = snapshotNoLeidos.size;

        return { 
          ...chat, 
          nombreMostrado: nombrePersonalizado, 
          foto: fotoPerfil,
          noLeidosCount
        };      
      }));
      setAllChats(personalizedChats);

      // Inicialmente mostrar solo chats grupales
      setVisibleChats(personalizedChats.filter(chat => chat.tipo === "grupo_proyecto"));
    };

    fetchChats();
  }, []);

useEffect(() => {
  if (!searchTerm.trim()) {
    setVisibleChats(allChats.filter(chat => chat.tipo === "grupo_proyecto"));
  } else {
    const filtered = allChats.filter(chat =>
      chat.nombreMostrado?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVisibleChats(filtered);
  }
}, [searchTerm, allChats]);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      // Si está vacío, mostrar solo chats grupales
      setVisibleChats(allChats.filter(chat => chat.tipo === "grupo_proyecto"));
    } else {
      // Si hay búsqueda, mostrar todos los chats que coincidan con el nombre personalizado
      const filtered = allChats.filter(chat =>
        chat.nombreMostrado?.toLowerCase().includes(term.toLowerCase())
      );
      setVisibleChats(filtered);
    }
  };

  // Función para cambiar el estado del botón activo
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para redirigir al chat grupal al hacer clic en un mensaje
  const handleChatClick = (chat) => {
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <NavbarT searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      
      <div style={{ padding: "20px" }}>
        <div style={styles.messageList}>

          {visibleChats.map((chat, index) => (
            <div
              key={chat.id}  // CAMBIAR index POR chat.id SOLO
              style={{
                ...styles.messageItem,
                  border: chat.noLeidosCount > 0 ? "2px solid #1ed760" : "none",
                  fontWeight: chat.noLeidosCount > 0 ? "bold" : "normal",
                  position: "relative", // necesario para posicionar el badge
                }}
              onClick={() => handleChatClick(chat)}
            >
              <div style={styles.userInfo}>
                {chat.foto ? (
                  <img src={chat.foto} alt="avatar" style={styles.userIcon} />
                ) : (
                  <div style={styles.userIconPlaceholder}>
                    {chat.nombreMostrado.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 style={styles.userName}>{chat.nombreMostrado}</h3>
                </div>
              </div>
            </div>
          ))}


        </div>
      </div>
      <BottomNavTeacher />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  messageList: {
    overflowY: "auto",
    maxHeight: "calc(100vh - 200px)",
  },
  unreadBadge: {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#f44336",
  color: "#fff",
  borderRadius: "12px",
  padding: "4px 8px",
  fontSize: "0.8rem",
  fontWeight: "bold",
  minWidth: "24px",
  textAlign: "center",
  lineHeight: "1.2",
  userSelect: "none",
},
  messageItem: {
    display: "flex",
    padding: "15px",
    backgroundColor: "#1a1a1a",
    marginBottom: "15px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  userIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userIconPlaceholder: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#333",
    color: "#fff",
    fontSize: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
};

export default ChatScreenTeacher;