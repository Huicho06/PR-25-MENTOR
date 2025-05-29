import React, { useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";



const GroupDetailsModal = ({ onClose, chatId, currentUserId }) => {
  const [activeTab, setActiveTab] = useState("miembros");
  const [miembros, setMiembros] = React.useState([]);
const [multimedia, setMultimedia] = React.useState([]);
const [archivos, setArchivos] = React.useState([]);
const [tareas, setTareas] = React.useState([]);

  
const navigate = useNavigate();


  useEffect(() => {
  if (!chatId) return;

  const fetchData = async () => {
    // 1. Obtener info del chat para sacar participantes
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) return;
    const chatData = chatSnap.data();
    const participantes = chatData.participantes || [];

    // 2. Traer datos completos de cada participante
    const miembrosData = [];
    for (const uid of participantes) {
      const userSnap = await getDoc(doc(db, "usuarios", uid));
      if (userSnap.exists()) {
        miembrosData.push({
          ...userSnap.data(),
          id: uid,
          esActual: uid === currentUserId,  // currentUserId lo pasas como prop
        });
      }
    }
    setMiembros(miembrosData);
let nombreProyecto = "";

    // 3. Obtener mensajes multimedia y archivos
    const mensajesRef = collection(db, "chats", chatId, "mensajes");
    const mensajesSnap = await getDocs(mensajesRef);

    const media = [];
    const docs = [];

    mensajesSnap.forEach((doc) => {
      const m = doc.data();
      if (m.archivoUrl) {
        const tipo = m.archivoTipo?.toLowerCase() || "";
        const nombre = m.archivoNombre || "";

        if (
          tipo.includes("image") || tipo.includes("video") ||
          /\.(jpg|png|gif|mp4|mov)$/i.test(nombre)
        ) {
          media.push(m);
        } else {
          docs.push(m);
        }
      }
    });
    
const solicitudesRef = collection(db, "solicitudes");
const qSolicitud = query(
  solicitudesRef,
  where("estado", "==", "aceptado"),
  where("estudiante_uid", "in", participantes)
);

const solicitudSnap = await getDocs(qSolicitud);
if (!solicitudSnap.empty) {
  nombreProyecto = solicitudSnap.docs[0].data().proyecto_nombre;
}

if (!solicitudSnap.empty) {
  const solicitudData = solicitudSnap.docs[0].data();
  const nombreProyecto = solicitudData.proyecto_nombre;
  const tutorUid = solicitudData.tutor_uid;

  if (nombreProyecto && tutorUid) {
    const tareasRef = collection(db, "tareas");
    const qTareas = query(
      tareasRef,
      where("grupo", "==", nombreProyecto),
      where("creadoPor", "==", tutorUid)
    );

    const tareasSnap = await getDocs(qTareas);
    const tareasData = tareasSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTareas(tareasData);
  }
}

if (!solicitudSnap.empty) {
  nombreProyecto = solicitudSnap.docs[0].data().proyecto_nombre;
}


    setMultimedia(media);
    setArchivos(docs);

// Luego usar nombreProyecto para filtrar tareas
const tareasRef = collection(db, "tareas");
const qTareas = query(tareasRef, where("grupo", "==", nombreProyecto));
const tareasSnap = await getDocs(qTareas);
const tareasData = tareasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setTareas(tareasData);
  };

  fetchData();
}, [chatId, currentUserId]);



 const renderContent = () => {
    switch (activeTab) {
      case "miembros":
        return miembros.map(m => (
          <div key={m.id} style={styles.memberItem}>
            👤 {m.nombre} {m.esActual ? <span style={styles.status}>Tú</span> : null} {m.admin ? <span style={{color: "green"}}>Admin.</span> : null}
          </div>
        ));
      case "multimedia":
  return (
    <div style={styles.gallery}>
      {multimedia.length === 0 && <p>No hay multimedia para mostrar.</p>}
      {multimedia.map((m, i) => {
        const tipo = m.archivoTipo?.toLowerCase() || "";
        const nombre = m.archivoNombre || "";

        if (tipo.includes("image") || /\.(jpg|jpeg|png|gif)$/i.test(nombre)) {
          return (
            <a
              key={i}
              href={m.archivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mediaItem}
            >
              <img
                src={m.archivoUrl}
                alt={nombre}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }}
              />
            </a>
          );
        } else if (tipo.includes("video") || /\.(mp4|mov|avi|wmv)$/i.test(nombre)) {
          return (
            <a
              key={i}
              href={m.archivoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.mediaItem}
            >
              <video
                src={m.archivoUrl}
                style={{ width: "100%", height: "100%", borderRadius: "8px" }}
                controls
              />
            </a>
          );
        } else {
          return null;
        }
      })}
    </div>
  );

case "archivos":
  return archivos.length === 0 ? (
    <p>No hay archivos para mostrar.</p>
  ) : (
    archivos.map((a, i) => (
      <a
        key={i}
        href={a.archivoUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={styles.fileItemLink}
        title={`Abrir ${a.archivoNombre}`}
      >
        📄 {a.archivoNombre}
      </a>
    ))
  );
    case "tareas":
      return tareas.length === 0 ? (
        <p>No hay tareas asignadas.</p>
      ) : (
tareas.map((t) => (
  <div
    key={t.id || t.titulo}
    style={styles.taskItem}
    onClick={() => navigate(`/details-task-student/${t.id}`)}
  >
    📝 {t.titulo || t.descripcion || "Sin título"}
  </div>
))

      );
    default:
      return null;

    }
  };

  return (
    
     <div style={styles.overlay} onClick={onClose}>
    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div style={styles.sidebar}>
        <button
          style={{ 
            ...styles.tabButton, 
            backgroundColor: activeTab === "miembros" ? "#1ed760" : "transparent" 
          }}
          onClick={() => setActiveTab("miembros")}
        >
          👥 Miembros
        </button>
        <button
          style={{ 
            ...styles.tabButton, 
            backgroundColor: activeTab === "multimedia" ? "#1ed760" : "transparent" 
          }}
          onClick={() => setActiveTab("multimedia")}
        >
          🖼️ Multimedia
        </button>
        <button
          style={{ 
            ...styles.tabButton, 
            backgroundColor: activeTab === "archivos" ? "#1ed760" : "transparent" 
          }}
          onClick={() => setActiveTab("archivos")}
        >
          📁 Archivos
        </button>
        <button
          style={{ 
            ...styles.tabButton, 
            backgroundColor: activeTab === "tareas" ? "#1ed760" : "transparent" 
          }}
          onClick={() => setActiveTab("tareas")}
        >
          📌 Tareas
        </button>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h2>
          <button style={styles.closeButton} onClick={onClose}>✖</button>
        </div>
        <div style={{ overflowY: "auto", maxHeight: "calc(100% - 50px)" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    display: "flex",
    backgroundColor: "#1a1a1a",
    width: "80%",
    height: "80%",
    borderRadius: "12px",
    overflow: "hidden",
    color: "#fff",
  },
  sidebar: {
    backgroundColor: "#0f0f0f",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "160px",
    borderRight: "1px solid #333",
  },
  tabButton: {
    background: "none",
    border: "none",
    color: "#fff",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "8px",
    borderRadius: "6px",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  searchInput: {
    padding: "8px",
    width: "100%",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
    marginBottom: "10px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  memberItem: {
    padding: "10px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
      marginBottom: "15px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  },
  mediaItem: {
  width: "100px",
  height: "100px",
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: "#2a2a2a",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "10px",
},
fileItemLink: {
  display: "block",
  padding: "10px",
  backgroundColor: "#2a2a2a",
  borderRadius: "8px",
  marginBottom: "10px",
  color: "#1ed760",
  fontWeight: "bold",
  textDecoration: "none",
  cursor: "pointer",
},
  fileItem: {
    padding: "10px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
      marginBottom: "15px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  },
taskItem: {
  padding: "12px",
  backgroundColor: "#2a2a2a",
  borderRadius: "8px",
  marginBottom: "15px",
  cursor: "pointer",
  transition: "background-color 0.2s",
},

  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
      marginBottom: "15px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  },

  status: {
    fontSize: "0.85rem",
    marginLeft: "8px",
    color: "#1ed760",
  },
};

export default GroupDetailsModal;
