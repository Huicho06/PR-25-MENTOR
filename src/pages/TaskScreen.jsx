import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NavbarStudent from "../components/NavbarStudent";
import BottomNav from "../components/BottomNav";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const TaskScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        // Supongamos que el campo que relaciona la tarea con el estudiante es 'creadoPor' o 'estudiante_uid'
        const q = query(
          collection(db, "tareas"),
          where("creadoPor", "==", user.uid) // Ajusta aquí si usas otro campo
        );
        const snapshot = await getDocs(q);
        const tareasData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tareasData);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    fetchTasks();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <NavbarStudent />

      <input
        type="text"
        placeholder="Buscar tarea"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#1a1a1a",
          color: "#fff",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      />

      {/* Listado dinámico de tareas */}
      <div style={styles.taskList}>
        {tasks
          .filter((task) =>
            task.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task) => (
            <div
              key={task.id}
              style={styles.taskItem}
onClick={() => navigate(`/details-task-student/${task.id}`)}

            >
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.titulo}</h3>

                <p style={styles.dueDate}>
                  Vence el{" "}
                  {task.fechaEntrega
                    ? new Date(task.fechaEntrega.seconds * 1000).toLocaleString()
                    : "Fecha no especificada"}
                </p>
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
  taskList: {
    marginTop: "10px",
    overflowY: "auto",
    height: "calc(100vh - 180px)",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    backgroundColor: "#1a1a1a",
    marginBottom: "10px",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer",
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#fff",
  },
  taskDetails: {
    fontSize: "1rem",
    color: "#ccc",
    marginTop: "5px",
  },
  dueDate: {
    fontSize: "0.9rem",
    color: "#bbb",
    marginTop: "5px",
  },
};

export default TaskScreen;
