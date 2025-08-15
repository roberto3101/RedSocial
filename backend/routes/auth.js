// backend/routes/auth.js
import { Router } from "express";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import passport from "passport";

import { findByEmail, upsert, findById } from "../userStore.js";
import { sendVerification }    from "../mailer.js";

const router  = Router();
const expires = "7d";
const sign    = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expires });
const bad     = (res, msg = "Credenciales") =>
  res.status(401).json({ msg });

/* ───────── Registro clásico ───────── */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email)
      return res.status(400).json({ msg: "Falta el correo" });

    if (password && password.length < 8) {
      return res.status(400).json({ msg: "La contraseña debe tener 8+ caracteres" });
    }

    const existing = await findByEmail(email);

    // Caso: el correo ya existe y fue creado SOLO con OAuth
    if (existing && !existing.hash) {
      return res
        .status(400)
        .json({ msg: "Ese correo ya está vinculado a Google/Facebook/GitHub" });
    }

  
  
  
    // 🚩 Si existe, no está verificado, reenvía código (permite reenviar desde frontend)
    /*
    if (existing && !existing.verified) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      existing.code = code;
      await upsert(existing);
      await sendVerification(email, code);
      return res.status(200).json({
        msg: "El email ya fue registrado pero no verificado. Se ha reenviado un nuevo código.",
        resend: true,
      });
    }
*/
    if (existing) {
      return res.status(409).json({ msg: "Email ya registrado" });
    }

    // Registro nuevo
    if (!password)
      return res.status(400).json({ msg: "Falta la contraseña" });

  const hash = await bcrypt.hash(password, 10);

const user = await upsert({ id: uuid(), email, hash, verified: true });

return res.status(201).json({ token: sign(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* ───────── Verificar correo ───────── */
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await findByEmail(email);
    if (!user || user.code !== code) return bad(res, "Código inválido");

    user.verified = true;
    delete user.code;
    await upsert(user);

    res.json({ token: sign(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* ───────── Login clásico ───────── */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email);
    if (!user) return bad(res);

    if (!user.hash)        return bad(res, "Usa Google/Facebook/GitHub");
    if (!user.verified)    return bad(res, "Verifica tu correo");

    const ok = await bcrypt.compare(password, user.hash);
    if (!ok) return bad(res);

    res.json({ token: sign(user.id) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Algo salió mal" });
  }
});

/* ───────── Solicitar reset de contraseña ───────── */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Falta el correo electrónico" });
    }

    const user = await findByEmail(email);
    
    // Por seguridad, siempre responder exitosamente, aunque el usuario no exista
    if (!user) {
      return res.status(200).json({ 
        msg: "Si el correo existe, recibirás un código de verificación" 
      });
    }

    // No permitir reset para usuarios OAuth-only
    if (!user.hash) {
      return res.status(400).json({ 
        msg: "Esta cuenta usa Google/Facebook/GitHub. Inicia sesión con esa plataforma." 
      });
    }

    // Generar código de reset de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Guardar código con timestamp de expiración (15 minutos)
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutos
    await upsert(user);

    // Enviar email con código
    await sendVerification(email, resetCode, "reset");

    res.status(200).json({ 
      msg: "Código de recuperación enviado a tu correo" 
    });

  } catch (err) {
    console.error("Error en forgot-password:", err);
    res.status(500).json({ msg: "Error del servidor. Intenta más tarde." });
  }
});

/* ───────── Verificar código de reset ───────── */
router.post("/verify-reset-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ msg: "Faltan datos requeridos" });
    }

    const user = await findByEmail(email);
    
    if (!user) {
      return res.status(400).json({ msg: "Código inválido o expirado" });
    }

    // Verificar código y expiración
    if (user.resetCode !== code || !user.resetCodeExpires || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ msg: "Código inválido o expirado" });
    }

    // Generar token temporal para cambio de contraseña (válido 10 minutos)
    const resetToken = jwt.sign(
      { id: user.id, type: "password-reset" }, 
      process.env.JWT_SECRET, 
      { expiresIn: "10m" }
    );

    res.status(200).json({ 
      msg: "Código verificado correctamente",
      resetToken 
    });

  } catch (err) {
    console.error("Error en verify-reset-code:", err);
    res.status(500).json({ msg: "Error del servidor. Intenta más tarde." });
  }
});

/* ───────── Cambiar contraseña con token ───────── */
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ msg: "Faltan datos requeridos" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
    }

    // Verificar token temporal
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    if (decoded.type !== "password-reset") {
      return res.status(400).json({ msg: "Token inválido" });
    }

    const user = await findById(decoded.id);
    if (!user) {
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    // Cambiar contraseña
    const newHash = await bcrypt.hash(newPassword, 10);
    user.hash = newHash;
    
    // Limpiar datos de reset
    delete user.resetCode;
    delete user.resetCodeExpires;
    
    await upsert(user);

    // Generar nuevo token de sesión
    const sessionToken = sign(user.id);

    res.status(200).json({ 
      msg: "Contraseña cambiada exitosamente",
      token: sessionToken 
    });

  } catch (err) {
    console.error("Error en reset-password:", err);
    res.status(500).json({ msg: "Error del servidor. Intenta más tarde." });
  }
});

/* ───────── Reenviar código de reset ───────── */
router.post("/resend-reset-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Falta el correo electrónico" });
    }

    const user = await findByEmail(email);
    
    if (!user || !user.hash) {
      return res.status(200).json({ 
        msg: "Si el correo existe, recibirás un nuevo código" 
      });
    }

    // Verificar que no se abuse del reenvío (máximo cada 60 segundos)
    if (user.lastResetSent && Date.now() - user.lastResetSent < 60000) {
      return res.status(429).json({ 
        msg: "Espera un minuto antes de solicitar otro código" 
      });
    }

    // Generar nuevo código
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    user.lastResetSent = Date.now();
    await upsert(user);

    await sendVerification(email, resetCode, "reset");

    res.status(200).json({ 
      msg: "Nuevo código enviado a tu correo" 
    });

  } catch (err) {
    console.error("Error en resend-reset-code:", err);
    res.status(500).json({ msg: "Error del servidor. Intenta más tarde." });
  }
});

/* ───────── Helper de éxito OAuth ───────── */
function oauthSuccess(req, res) {
  const token = sign(req.user.id);
  res.redirect(`${process.env.FRONT_URL}/oauth/success?token=${token}`);
}

/* ───────── Google ───────── */
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONT_URL}/login` }),
  oauthSuccess
);

/* ───────── Facebook ───────── */
router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: `${process.env.FRONT_URL}/login` }),
  oauthSuccess
);

/* ───────── GitHub ───────── */
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: `${process.env.FRONT_URL}/login` }),
  oauthSuccess
);

export default router;