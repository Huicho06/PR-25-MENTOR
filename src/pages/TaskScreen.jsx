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
  const [statusFilter, setStatusFilter] = useState("todas");

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

    const fetchTasksForStudent = async () => {
      try {
const qSolicitud = query(
  collection(db, "solicitudes"),
  where("proyecto_integrantes_ids", "array-contains", user.uid),
  where("estado", "==", "aceptado")
);

const solicitudSnapshot = await getDocs(qSolicitud);
console.log("Solicitudes aceptadas:", solicitudSnapshot.docs.length);


        if (solicitudSnapshot.empty) {
          setTasks([]);
          return;
        }

const solicitudData = solicitudSnapshot.docs[0].data();
const tutorUid = solicitudData.tutor_uid;
const proyectoNombre = solicitudData.proyecto_nombre;

console.log("Tutor UID:", tutorUid);
console.log("Nombre del proyecto:", proyectoNombre);

const qTareas = query(
  collection(db, "tareas"),
  where("creadoPor", "==", tutorUid),
  where("grupo", "==", proyectoNombre)
);
const tareasSnapshot = await getDocs(qTareas);
console.log("Tareas encontradas:", tareasSnapshot.docs.length);

        const tareas = tareasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const entregasSnapshot = await getDocs(query(
          collection(db, "Entregas"),
          where("estudianteUid", "==", user.uid)
        ));
        const entregas = entregasSnapshot.docs.map(doc => doc.data());

        // Unir tareas con su estado actual
        const tareasConEstado = tareas.map(t => {
          const entrega = entregas.find(e => e.tareaId === t.id);
          let estado = "pendiente";
          if (entrega?.estado === "revisada") estado = "revisada";
          else if (entrega?.estado === "entregado") estado = "entregada";
console.log("Proyecto:", proyectoNombre);
console.log("Tutor UID:", tutorUid);
          return {
            ...t,
            estado,
            entregaInfo: entrega || null,
          };
        });

        setTasks(tareasConEstado);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
      }
    };

    fetchTasksForStudent();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredTasks = tasks
    .filter(task => task.titulo?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(task => statusFilter === "todas" || task.estado === statusFilter);

  return (
    <div style={styles.wrapper}>
      <Navbar />
      <NavbarStudent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
          <div
            key={task.id}
            style={styles.taskItem}
            onClick={() => navigate(`/details-task-student/${task.id}`)}
          >
            <div style={styles.taskInfo}>
              <h3 style={styles.taskTitle}>{task.titulo}</h3>
              <p style={styles.dueDate}>
                {task.estado === "revisada" && task.entregaInfo?.fechaRevision ? (
                  <>Revisada el {new Date(task.entregaInfo.fechaRevision.seconds * 1000).toLocaleString()}</>
                ) : task.estado === "entregada" && task.entregaInfo?.fechaEntregaReal ? (
                  <>Entregada el {new Date(task.entregaInfo.fechaEntregaReal.seconds * 1000).toLocaleString()}</>
                ) : (
                  <>Vence el {task.fechaEntrega ? new Date(task.fechaEntrega.seconds * 1000).toLocaleString() : "sin fecha"}</>
                )}
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
  dueDate: {
    fontSize: "0.9rem",
    color: "#bbb",
    marginTop: "5px",
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

export default TaskScreen;
