import React from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import logoMentor from "../assets/logo.png";

const StudentHome = () => {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.backgroundImage}>
          <img src={logoMentor} alt="Logo Mentor" style={styles.logoBackground} />
        </div>
        <div style={styles.content}>
          <h1 style={styles.title}>Bienvenido, Tesista</h1>
          <p style={styles.description}>
            En este espacio podrás colaborar con tu tutor, organizar tus tareas y avanzar en tu proyecto académico con orden y claridad.
          </p>
          <p style={styles.description}>
            Recuerda que cada paso que das te acerca a la culminación exitosa de tu tesis.
          </p>
          <div style={styles.highlightBox}>
            <h2 style={styles.highlightTitle}>Consejo para tesistas:</h2>
            <p style={styles.highlightText}>
              Mantén una comunicación constante con tu tutor, planifica tus metas y no dudes en pedir ayuda cuando la necesites.
            </p>
          </div>
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
    position: "relative",
  },
  backgroundImage: {
    position: "relative",
    height: "250px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.15,
  },
  logoBackground: {
    maxWidth: "60%",
    height: "auto",
    userSelect: "none",
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
    marginBottom: "20px",       // más espacio abajo
    lineHeight: "1.8",          // interlineado aumentado
  },
  highlightBox: {
    marginTop: "20px",
    backgroundColor: "#14532d",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "left",
  },
  highlightTitle: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#d1fae5",
  },
  highlightText: {
    fontSize: "1rem",
    color: "#a7f3d0",
    lineHeight: "1.6",
  },
};

export default StudentHome;
