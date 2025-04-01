const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/enviar-codigo", async (req, res) => {
  const { correo, codigo } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    }
  });

  const mensajeHTML = `
  <div style="font-family: sans-serif; background-color: #0a0a0a; color: #ffffff; padding: 30px; border-radius: 10px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.imgur.com/Jypo0A5.png" alt="MENTOR Logo" width="120" />
    </div>

    <h2 style="color: #1ed760;">Restablece tu contraseña de MENTOR</h2>

    <p>Hola,</p>

    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta de MENTOR asociada al correo <strong>${correo}</strong>.</p>

    <p>Tu código de recuperación es:</p>

    <div style="text-align: center; margin: 20px 0;">
      <div style="display: inline-block; padding: 12px 24px; font-size: 28px; font-weight: bold; background-color: #1ed760; color: #000; border-radius: 10px;">
        ${codigo}
      </div>
    </div>

    <p>Este código es válido por <strong>15 minutos</strong>. Por favor, ingrésalo en la aplicación para continuar con el cambio de contraseña.</p>

    <p style="color: #aaa; font-size: 12px;">
      Si no solicitaste este restablecimiento, puedes ignorar este mensaje.
    </p>

    <br/>

    <p style="font-size: 14px;">Gracias,<br/>El equipo de <strong>MENTOR</strong></p>

  </div>
`;


  try {
    await transporter.sendMail({
      from: `"MENTOR" <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: "Tu código de recuperación",
      html: mensajeHTML,
    });

    res.status(200).json({ ok: true, mensaje: "Correo enviado correctamente" });
  } catch (error) {
    console.error("❌ Error al enviar correo:", error);
    res.status(500).json({ ok: false, error: "No se pudo enviar el correo" });
  }
});

app.listen(3001, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3001");
});
