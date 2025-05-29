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
  const [statusFilter, setStatusFilter] = useState("todas");
const [refresh, setRefresh] = useState(false);

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
useEffect(() => {
  if (!user) return;

  const fetchTasksAndEntregas = async () => {
    try {
      // 1. Obtener todas las tareas del docente
      const tareasQuery = query(collection(db, "tareas"), where("creadoPor", "==", user.uid));
      const tareasSnapshot = await getDocs(tareasQuery);
      const tareas = tareasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2. Obtener todas las entregas de estas tareas
      const entregasSnapshot = await getDocs(collection(db, "Entregas"));
const entregas = entregasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

const tareasConEstado = tareas.map(t => {
  const entregasTarea = entregas.filter(e => e.tareaId === t.id);
  const entregaRevisada = entregasTarea.find(e => e.estado === "revisada");
  const tieneRevisadas = !!entregaRevisada;
  const tieneEntregadas = entregasTarea.some(e => e.estado === "entregado");

  let estado = "pendiente";
  if (tieneRevisadas) estado = "revisada";
  else if (tieneEntregadas) estado = "entregada";

  return {
    ...t,
    estado,
    fechaRevision: entregaRevisada?.fechaRevision ?? null, // 🔥 necesario para que funcione
  };
});


      setTasks(tareasConEstado);
    } catch (error) {
      console.error("Error cargando tareas o entregas:", error);
    }
  };

  fetchTasksAndEntregas();
}, [user, refresh]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddTask = () => {
    navigate("/create-task-teacher");
  };

  const filteredTasks = tasks
    .filter((task) => task.titulo?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((task) => statusFilter === "todas" || task.estado === statusFilter);

  return (
    <div style={styles.wrapper}>
      <MainNavbar />
      <NavbarT searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ color: "white", marginRight: "10px" }}>Filtrar por estado:</label>
        <select value={statusFilter} onChange={handleStatusChange} style={styles.select}>
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="entregada">Entregadas</option>
          <option value="revisada">Revisadas</option>
        </select>
      </div>

      <div style={styles.taskList}>
        {filteredTasks.map((task) => (
          <div key={task.id} style={styles.taskItem}>
            <div style={styles.taskInfo}>
              <h3 style={styles.taskTitle}>{task.titulo}</h3>
              <p style={styles.taskDetails}><strong>Asignado a:</strong> {task.grupo}</p>
<p style={styles.dueDate}>
  {task.estado === "revisada" && task.fechaRevision ? (
    <>Revisada el {new Date(task.fechaRevision.seconds * 1000).toLocaleString()}</>
  ) : (
    <>Vence el {task.fechaEntrega ? new Date(task.fechaEntrega.seconds * 1000).toLocaleString() : ""}</>
  )}
</p>

              {task.estado === "entregada" && (
                <button onClick={() => navigate(`/review-task/${task.id}`)} style={styles.reviewButton}>
                  Revisar entrega
                </button>
              )}
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
    height: "calc(100vh - 240px)",
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
  reviewButton: {
    marginTop: "10px",
    backgroundColor: "#1ed760",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
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
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#000",
    fontWeight: "bold",
  },
};

export default TaskScreenTeacher;
