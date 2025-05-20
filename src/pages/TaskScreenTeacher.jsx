import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import BottomNavTeacher from "../components/BottomNavTeacher";
import NavbarT from "../components/NavbarTeacher";
import MainNavbar from "../components/MainNavbar";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "/src/services/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const TaskScreenTeacher = () => {
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
        // Consulta para obtener las tareas del docente actual
        const q = query(
          collection(db, "tareas"),
          where("creadoPor", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    fetchTasks();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddTask = () => {
    navigate("/create-task-teacher");
  };

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <NavbarT searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>


      <div style={styles.taskList}>
        {tasks
          .filter((task) =>
            task.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task) => (
<div
  key={task.id}
  style={styles.taskItem}
  onClick={() => navigate(`/details-task-teacher/${task.id}`)}
>
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.titulo}</h3>
                <p style={styles.taskDetails}>
                  <strong>Asignado a:</strong> {task.grupo}
                </p>
                <p style={styles.dueDate}>
                  🕒 Vence el{" "}
                  {task.fechaEntrega
                    ? new Date(task.fechaEntrega.seconds * 1000).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          ))}
      </div>

      <button onClick={handleAddTask} style={styles.fabButton}>
        <FaPlus size={18} />
      </button>

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
    padding: "20px",
    position: "relative",
  },
  taskList: {
    flex: 1,
    overflowY: "auto",
    height: "calc(100vh - 180px)",
  },
  taskItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
    color: "#fff",
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
    fontSize: "0.95rem",
    color: "#ccc",
    marginTop: "5px",
  },
  dueDate: {
    fontSize: "0.9rem",
    color: "#bbb",
    marginTop: "5px",
  },
  fabButton: {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    color: "#fff",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
    cursor: "pointer",
    zIndex: 999,
  },
};

export default TaskScreenTeacher;
