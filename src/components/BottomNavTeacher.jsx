import React, { useEffect, useState } from "react";
import { FaHome, FaComments, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavTeacher = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const path = location.pathname.toLowerCase();

    if (path === "/mainteacher") {
      setActiveTab("home");
    } else if (path.includes("chatscreenteacher") || path.includes("taskscreenteacher")) {
      setActiveTab("chats");
    } else if (path === "/profilescreenteacher") {
      setActiveTab("profile");
    } else {
      setActiveTab(null); // ningún tab activo
    }
  }, [location]);

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    if (tab === "home") {
      navigate("/mainTeacher");
    } else if (tab === "profile") {
      navigate("/ProfileScreenTeacher");
    } else if (tab === "chats") {
      navigate("/chatScreenTeacher");
    }
  };

  return (
    <div style={styles.navBar}>
      <div
        style={activeTab === "home" ? styles.activeNavItem : styles.navItem}
        onClick={() => handleNavigation("home")}
      >
        <FaHome style={styles.icon} />
        <span>Principal</span>
      </div>

      <div
        style={activeTab === "chats" ? styles.activeNavItem : styles.navItem}
        onClick={() => handleNavigation("chats")}
      >
        <FaComments style={styles.icon} />
        <span>Chats</span>
      </div>

      <div
        style={activeTab === "profile" ? styles.activeNavItem : styles.navItem}
        onClick={() => handleNavigation("profile")}
      >
        <FaUser style={styles.icon} />
        <span>Mi Perfil</span>
      </div>
    </div>
  );
};

const styles = {
  navBar: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "10px 0",
    zIndex: 1000,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    boxSizing: "border-box",
  },
  navItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
  },
  activeNavItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "#1ed760",
    cursor: "pointer",
  },
  icon: {
    fontSize: "24px",
    marginBottom: "5px",
  },
};

export default BottomNavTeacher;
