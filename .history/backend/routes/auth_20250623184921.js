// backend/routes/auth.js
import { Router } from "express";
import bcrypt   from "bcryptjs";
import jwt      from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import passport from "passport";

import { findByEmail, upsert } from "../userStore.js";
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

    if (existing) {
      return res.status(409).json({ msg: "Email ya registrado" });
    }

    // Registro nuevo
    if (!password)
      return res.status(400).json({ msg: "Falta la contraseña" });

    const hash = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await upsert({ id: uuid(), email, hash, verified: false, code });
    await sendVerification(email, code);

    return res.status(201).json({ msg: "Código enviado" });
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