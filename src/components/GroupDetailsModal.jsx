import React, { useState } from "react";

const GroupDetailsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("miembros");

  const renderContent = () => {
    switch (activeTab) {
      case "miembros":
        return (
          <div style={styles.content}>
            <input type="text" placeholder="Buscar miembros" style={styles.searchInput} />
            <div style={styles.memberItem}>👤 Tú <span style={styles.status}>En línea</span></div>
            <div style={styles.memberItem}>👤 Pablin <span style={styles.status}>Admin.</span></div>
            <div style={styles.memberItem}>👤 Daniel Escobar</div>
            <div style={styles.memberItem}>👤 Erick</div>
            <div style={styles.memberItem}>👤 Franco</div>
            <div style={styles.memberItem}>👤 Lolita Uní</div>
          </div>
        );
      case "multimedia":
        return (
          <div style={styles.gallery}>
            {[...Array(12)].map((_, i) => (
              <div key={i} style={styles.mediaItem}>📸</div>
            ))}
          </div>
        );
      case "archivos":
        return (
          <div style={styles.content}>
            <div style={styles.fileItem}>📄 CASO PRACTICO clubVid_2025.pdf</div>
            <div style={styles.fileItem}>📄 caso5_contactCenter.pdf</div>
            <div style={styles.fileItem}>📄 Diseño de DWH.pdf</div>
          </div>
        );
      case "tareas":
        return (
          <div style={styles.content}>
            <div style={styles.taskItem}>📝 Entregar wireframes iniciales</div>
            <div style={styles.taskItem}>📝 Subir propuesta de diseño UI</div>
            <div style={styles.taskItem}>📝 Revisión de requisitos</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.sidebar}>
          <button style={styles.tabButton} onClick={() => setActiveTab("miembros")}>👥 Miembros</button>
          <button style={styles.tabButton} onClick={() => setActiveTab("multimedia")}>🖼️ Multimedia</button>
          <button style={styles.tabButton} onClick={() => setActiveTab("archivos")}>📁 Archivos</button>
          <button style={styles.tabButton} onClick={() => setActiveTab("tareas")}>📌 Tareas</button>
        </div>
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h2 style={{ margin: 0 }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <button style={styles.closeButton} onClick={onClose}>✖</button>
          </div>
          {renderContent()}
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
  },
  fileItem: {
    padding: "10px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
  },
  taskItem: {
    padding: "10px",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
  },
  gallery: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
    gap: "10px",
  },
  mediaItem: {
    backgroundColor: "#2a2a2a",
    height: "100px",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    fontSize: "0.85rem",
    marginLeft: "8px",
    color: "#1ed760",
  },
};

export default GroupDetailsModal;
