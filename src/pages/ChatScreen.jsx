import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Para la navegación
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda
import { FiMessageCircle } from "react-icons/fi"; // Icono de mensaje
import BottomNav from "../components/BottomNav"; // Para la barra de navegación
import Navbar from "../components/Navbar"; // Para la barra de navegación // Para la barra de navegación
import NavbarStudent from "../components/NavbarStudent";
import { getDocs, collection, query, where , doc, getDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "/src/services/firebase"; 

const getUserNameByUID = async (uid) => {
  const docRef = doc(db, "usuarios", uid);
  const userSnap = await getDoc(docRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.nombre || "Usuario";
  }
  return "Desconocido";
};
const getUserInfoByUID = async (uid) => {
  const docSnap = await getDoc(doc(db, "usuarios", uid));
  if (docSnap.exists()) {
    return docSnap.data(); // debe tener .nombre y .foto
  }
  return { nombre: "Usuario", foto: null };
};


const ChatScreen = () => { 
  const [activeTab, setActiveTab] = useState("chat"); // Estado para manejar qué botón está activo
  const [searchTerm, setSearchTerm] = useState(""); // Para la barra de búsqueda
  const navigate = useNavigate(); // Hook para la navegación

  const [chats, setChats] = useState([]);
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

    // 🔽 Este bloque es el que me pediste que te diga dónde va
    const personalizedChats = await Promise.all(chatList.map(async (chat) => {
  let nombrePersonalizado = chat.nombre;
  let fotoPerfil = null;

  if (chat.tipo === "personal") {
    const yo = await getUserInfoByUID(user.uid);
    nombrePersonalizado = `${yo.nombre} (Tú)`;
    fotoPerfil = yo.foto || null;
  } else if (chat.tipo === "compañero") {
    const otroUID = chat.participantes.find((uid) => uid !== user.uid);
    const otro = await getUserInfoByUID(otroUID);
    nombrePersonalizado = otro.nombre;
    fotoPerfil = otro.foto || null;
  } else if (chat.tipo === "tutor_estudiante") {
    const tutorUID = chat.participantes.find((uid) => uid !== user.uid);
    const tutor = await getUserInfoByUID(tutorUID);
    nombrePersonalizado = tutor.nombre;
    fotoPerfil = tutor.foto || null;
  } else if (chat.tipo === "grupo_proyecto") {
    nombrePersonalizado = `Grupo: ${chat.nombre.split(":")[1]?.trim() || chat.nombre}`;
    fotoPerfil = null; // No tiene foto
  }

  return { ...chat, nombreMostrado: nombrePersonalizado, foto: fotoPerfil };
}));


    setChats(personalizedChats);
  };

  fetchChats();
}, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para cambiar el estado del botón activo
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para redirigir al chat grupal al hacer clic en un mensaje
  const handleChatClick = (user) => {
    // Navega a la pantalla del chat del grupo y pasa el nombre del usuario o identificador
    navigate("/groupChat", { state: { participants: user } });
  };

  return (
    <div style={styles.wrapper}>
 
      <Navbar />
    <NavbarStudent searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
      {/* Listado de mensajes */}
      <div style={styles.messageList}>
       {chats
        .filter((chat) => chat.nombreMostrado?.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((chat, index) => (
          <div
            key={index}
            style={styles.messageItem}
            onClick={() => navigate(`/chat/${chat.id}`)}
          >
            <div style={styles.userInfo}>
              {chat.foto ? (
                <img src={chat.foto} alt="avatar" style={styles.userImage} />
              ) : (
                <div style={styles.userIcon}>{chat.nombreMostrado.charAt(0)}</div>
              )}
              <div>
                <h3 style={styles.userName}>{chat.nombreMostrado}</h3>
                
              </div>
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
  userImage: {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  marginRight: "10px"
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
    marginBottom: "20px",
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
