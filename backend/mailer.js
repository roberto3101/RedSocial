// backend/mailer.js
import nodemailer from "nodemailer";

/* ---------- Config común ---------- */
const { MAIL_USER, MAIL_PASS, NODE_ENV } = process.env;

/* ---------- Transport: si falla Gmail usa Ethereal ---------- */
let transporter;

/* ① Producción con Gmail (App Password) */
if (NODE_ENV === "production" && MAIL_USER && MAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
}
/* ② Desarrollo: transport “Ethereal” (inbox temporal) */
else {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
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
export async function sendVerification(to, code) {
  const info = await transporter.sendMail({
    from:   `"Blog Roberto" <no-reply@blogroberto.dev>`,
    to,
    subject: "Tu código de verificación",
    text:    `Tu código es: ${code}`,
    html:    `<p>Tu código es: <b>${code}</b></p>`,
  });

  // Siempre imprime el código en la consola como backup
  console.log(`📧 Código ${code} enviado a ${to}`);

  // Si es Ethereal muestra la URL de preview
  if (nodemailer.getTestMessageUrl(info)) {
    console.log(`📨 Vista previa: ${nodemailer.getTestMessageUrl(info)}`);
  }
}
