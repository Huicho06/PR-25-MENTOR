import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RegistroEstudiante = () => {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    nacimiento: { dia: "", mes: "", anio: "" },
    genero: "",
    idiomas: "",
    descripcion: "",
    ciudad: "",
    estado: "",
    direccion1: "",
    direccion2: "",
    codigoPostal: "",
    tipoClase: "",
  });

  const cambiarValor = (campo, valor) => {
    setFormulario({ ...formulario, [campo]: valor });
  };

  const cambiarNacimiento = (parte, valor) => {
    setFormulario({ ...formulario, nacimiento: { ...formulario.nacimiento, [parte]: valor } });
  };

  const enviarFormulario = () => {
    console.log("Datos del estudiante:", formulario);
    navigate("/verify/student");

  };

  return (
    <div style={estilos.wrapper}>
      <div style={estilos.container}>
        <div style={estilos.header}>
          <button style={estilos.backBtn} onClick={() => navigate("/registertype")}>←</button>
          <h2 style={estilos.title}>Tus datos</h2>

          <div style={estilos.steps}>
            {[1, 2].map((paso, index) => (
              <div key={index} style={estilos.stepContainer}>
                <div style={{
                  ...estilos.stepCircle,
                  backgroundColor: paso <= 1 ? "#1ed760" : "#444",
                  color: paso <= 2 ? "#000" : "#ccc"
                }}>
                  {paso}
                </div>
                {paso !== 2 && <div style={{
                  ...estilos.stepLine,
                  backgroundColor: paso < 2 ? "#1ed760" : "#666"
                }} />}
              </div>
            ))}
          </div>
        </div>

        <input style={estilos.input} placeholder="Nombre" value={formulario.nombre} onChange={e => cambiarValor("nombre", e.target.value)} />
        <input style={estilos.input} placeholder="Correo electrónico" value={formulario.correo} onChange={e => cambiarValor("correo", e.target.value)} />
        <input style={estilos.input} placeholder="Número de teléfono" value={formulario.telefono} onChange={e => cambiarValor("telefono", e.target.value)} />

        <div style={estilos.row}>
          <input style={estilos.inputSmall} placeholder="DD" value={formulario.nacimiento.dia} onChange={e => cambiarNacimiento("dia", e.target.value)} />
          <input style={estilos.inputSmall} placeholder="MM" value={formulario.nacimiento.mes} onChange={e => cambiarNacimiento("mes", e.target.value)} />
          <input style={estilos.inputSmall} placeholder="AAAA" value={formulario.nacimiento.anio} onChange={e => cambiarNacimiento("anio", e.target.value)} />
        </div>

        <div style={estilos.row}>
          <label style={estilos.radio}>
            <input type="radio" name="genero" value="masculino" onChange={() => cambiarValor("genero", "masculino")} /> Masculino
          </label>
          <label style={estilos.radio}>
            <input type="radio" name="genero" value="femenino" onChange={() => cambiarValor("genero", "femenino")} /> Femenino
          </label>
        </div>

        <input style={estilos.input} placeholder="Idiomas que conoces" value={formulario.idiomas} onChange={e => cambiarValor("idiomas", e.target.value)} />
        <textarea style={estilos.textarea} placeholder="Escribe algo sobre ti..." value={formulario.descripcion} onChange={e => cambiarValor("descripcion", e.target.value)} />

        <h3 style={estilos.section}>Tu dirección</h3>
        <input style={estilos.input} placeholder="Ciudad*" value={formulario.ciudad} onChange={e => cambiarValor("ciudad", e.target.value)} />
        <input style={estilos.input} placeholder="Departamento*" value={formulario.estado} onChange={e => cambiarValor("estado", e.target.value)} />
        <input style={estilos.input} placeholder="Nombre de la casa" value={formulario.direccion1} onChange={e => cambiarValor("direccion1", e.target.value)} />
        <input style={estilos.input} placeholder="Dirección línea 2" value={formulario.direccion2} onChange={e => cambiarValor("direccion2", e.target.value)} />
        <input style={estilos.input} placeholder="Código postal" value={formulario.codigoPostal} onChange={e => cambiarValor("codigoPostal", e.target.value)} />

        <h3 style={estilos.section}>Tipo de clase preferido</h3>
        <input style={estilos.input} placeholder="Clase online" value={formulario.tipoClase} onChange={e => cambiarValor("tipoClase", e.target.value)} />

        <button style={estilos.button} onClick={enviarFormulario}>Continuar</button>
      </div>
    </div>
  );
};

const estilos = {
  wrapper: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 600,
    color: "#fff",
    fontFamily: "sans-serif",
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 24,
    backgroundColor: "#1a1a1a",
    color: "#1ed760",
    border: "none",
    borderRadius: 8,
    padding: "5px 12px",
    cursor: "pointer",
    marginBottom: 10,
  },
  title: {
    fontSize: "1.4rem",
    marginBottom: 10,
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  stepContainer: {
    display: "flex",
    alignItems: "center",
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    textAlign: "center",
    lineHeight: "24px",
    fontWeight: "bold",
    fontSize: 12,
  },
  stepLine: {
    width: 30,
    height: 2,
    margin: "0 5px",
  },
  section: {
    fontSize: "1rem",
    fontWeight: "bold",
    margin: "20px 0 10px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 15,
  },
  textarea: {
    width: "100%",
    height: 80,
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
    marginBottom: 15,
  },
  row: {
    display: "flex",
    gap: 10,
    marginBottom: 15,
    flexWrap: "wrap",
  },
  inputSmall: {
    flex: "1 1 30%",
    minWidth: "80px",
    padding: "12px",
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "none",
  },
  radio: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.95rem",
  },
  button: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1ed760",
    color: "#000",
    border: "none",
    borderRadius: 10,
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: 30,
    cursor: "pointer",
  },
};

export default RegistroEstudiante;