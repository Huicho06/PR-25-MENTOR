export const enviarCorreoRecuperacion = async (correo, codigo) => {
    const response = await fetch("http://localhost:3001/enviar-codigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, codigo }),
    });
  
    const data = await response.json();
    if (!data.ok) {
      throw new Error("No se pudo enviar el correo");
    }
  };
  