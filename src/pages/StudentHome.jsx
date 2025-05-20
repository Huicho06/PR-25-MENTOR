import React from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

const StudentHome = () => {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.backgroundImage}></div>
        <div style={styles.content}>
          <h1 style={styles.title}>Bienvenido a MENTOR</h1>
          <p style={styles.description}>
            En esta plataforma podrás colaborar con tu tutor, gestionar tareas,
            y dar seguimiento a tu proyecto académico de forma organizada.
          </p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    width: "100%",
    maxWidth: 600,
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  backgroundImage: {
    backgroundImage: "url('./assets/ingChristianFrente.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "250px",
    borderRadius: "15px",
    marginBottom: "20px",
  },
  content: {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "15px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  description: {
    fontSize: "1rem",
    color: "#ccc",
  },
};

export default StudentHome;
