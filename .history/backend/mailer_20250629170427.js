// backend/mailer.js
import nodemailer from "nodemailer";

/* ---------- Config común ---------- */
const { MAIL_USER, MAIL_PASS, NODE_ENV } = process.env;

/* ---------- Transport: si falla Gmail usa Ethereal ---------- */
let transporter;

/* ① Producción con Gmail (App Password) */
if (NODE_ENV === "production" && MAIL_USER && MAIL_PASS) {
  transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
}
/* ② Desarrollo: transport "Ethereal" (inbox temporal) */
else {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransporter({
    host:   "smtp.ethereal.email",
    port:   587,
    secure: false,
    auth:   {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  console.log(
    `✉️  Mail DEV - se usará Ethereal. Login:`,
    testAccount.user,
    testAccount.pass
  );
}

/* ---------- API a usar en auth.js ---------- */
export async function sendVerification(to, code, type = "verify") {
  const isReset = type === "reset";
  
  const subject = isReset 
    ? "🔐 Código de recuperación de contraseña"
    : "✅ Verificación de cuenta";
    
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; border-radius: 8px;">
      <h2 style="color: #333; text-align: center;">${isReset ? '🔐 Recupera tu contraseña' : '✅ Verifica tu cuenta'}</h2>
      <p style="color: #666; font-size: 16px;">Tu código ${isReset ? 'de recuperación' : 'de verificación'} es:</p>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
        ${code}
      </div>
      <p style="color: #666; font-size: 14px;">${isReset 
        ? 'Este código expira en 15 minutos. Si no solicitaste este cambio, ignora este email.' 
        : 'Usa este código para completar tu registro.'
      }</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">Blog Roberto - Sistema de autenticación</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"Blog Roberto" <no-reply@blogroberto.dev>`,
    to,
    subject,
    text: `Tu código es: ${code}`,
    html,
  });

  // Siempre imprime el código en la consola como backup
  console.log(`📧 Código ${code} enviado a ${to} (${type})`);

  // Si es Ethereal muestra la URL de preview
  if (nodemailer.getTestMessageUrl(info)) {
    console.log(`📨 Vista previa: ${nodemailer.getTestMessageUrl(info)}`);
  }
}