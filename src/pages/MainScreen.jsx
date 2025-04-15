import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const MainScreen = () => {
  const navigate = useNavigate();

  const experts = [
    {
      name: "Cristian Salvatierra",
      role: "Ingeniero en Sistemas",
      availability: "Disponible",
      projects: 8,
      imgSrc: "https://placeimg.com/100/100/people", // Reemplazar con imágenes reales
    },
    {
      name: "Raul Vera",
      role: "Ingeniero en Sistemas",
      availability: "Disponible",
      projects: 3,
      imgSrc: "https://placeimg.com/100/100/people", // Reemplazar con imágenes reales
    },
    {
      name: "Javier Vasquez",
      role: "Ingeniero en Sistemas",
      availability: "No disponible",
      projects: 0,
      imgSrc: "https://placeimg.com/100/100/people", // Reemplazar con imágenes reales
    },
    {
      name: "Cecilia",
      role: "Ingeniero en Sistemas",
      availability: "Disponible",
      projects: 5,
      imgSrc: "https://placeimg.com/100/100/people", // Reemplazar con imágenes reales
    },
  ];

  return (
    <div style={styles.wrapper}>
      <div style={styles.navBar}>
        <img src={logo} alt="Logo Mentor" style={styles.logo} />
        <div style={styles.navItems}>
          <div onClick={() => navigate("/profile")} style={styles.navItem}>
            Profile
          </div>
          <div onClick={() => navigate("/settings")} style={styles.navItem}>
            Settings
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <h2 style={styles.title}>Hi, ALEX</h2>
        <p style={styles.subtitle}>What would you like to learn Today?</p>

        <div style={styles.categories}>
          <button style={styles.categoryButton}>3D Design</button>
          <button style={styles.categoryButton}>Human Computer AI</button>
          <button style={styles.categoryButton}>Database</button>
        </div>

        <h3 style={styles.specializationTitle}>Áreas de Especialización</h3>
        <div style={styles.specialization}>
          <button style={styles.categoryButton}>Programación Web</button>
          <button style={styles.categoryButton}>Base de Datos</button>
          <button style={styles.categoryButton}>Redes y Comunicaciones</button>
        </div>

        <div style={styles.cardContainer}>
          {experts.map((expert, index) => (
            <div key={index} style={styles.card}>
              <img src={expert.imgSrc} alt={expert.name} style={styles.cardImage} />
              <div style={styles.cardInfo}>
                <h4 style={styles.cardTitle}>{expert.name}</h4>
                <p style={styles.cardRole}>{expert.role}</p>
                <p style={styles.cardAvailability}>{expert.availability}</p>
                <p style={styles.cardProjects}>{expert.projects} Proyectos activos</p>
                <button style={styles.cardButton}>Ver Perfil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: "10px 20px",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  logo: {
    width: 120,
  },
  navItems: {
    display: "flex",
    alignItems: "center",
  },
  navItem: {
    margin: "0 10px",
    cursor: "pointer",
    color: "#1ed760",
    fontWeight: "bold",
  },
  container: {
    padding: "70px 20px 20px",
    marginTop: "50px", // Para que no se superponga con el navbar
  },
  title: {
    fontSize: "2rem",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#ccc",
    marginBottom: 30,
  },
  categories: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryButton: {
    padding: "10px 20px",
    backgroundColor: "#1ed760",
    color: "#fff",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  specializationTitle: {
    fontSize: "1.5rem",
    marginBottom: 10,
  },
  specialization: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#1a1a1a",
    width: "22%",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
    textAlign: "center",
  },
  cardImage: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  cardInfo: {
    color: "#fff",
  },
  cardTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  cardRole: {
    fontSize: "1rem",
    marginBottom: "5px",
    color: "#ccc",
  },
  cardAvailability: {
    fontSize: "0.9rem",
    marginBottom: "5px",
    color: "#1ed760",
  },
  cardProjects: {
    fontSize: "0.9rem",
    marginBottom: "10px",
    color: "#ccc",
  },
  cardButton: {
    backgroundColor: "#1ed760",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default MainScreen;
