const express = require("express");
const jwt = require("jsonwebtoken");
const prisma = require("./src/prisma");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "segredo-muito-seguro";

// ROTA DE LOGIN PARA MEMBROS
router.post("/login/members", async (req, res) => {
  const { apelido, password } = req.body;

  try {
    const membro = await prisma.membro.findUnique({
      where: { apelido },
    });

    if (!membro) {
      return res.status(401).json({ error: "Membro não encontrado" });
    }

    // Se estiver usando senha em texto puro:
    const isValid = password === membro.password;

    // Se estiver usando senha criptografada (recomendado):
    // const isValid = await bcrypt.compare(password, membro.password);

    if (!isValid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: membro.id,
        apelido: membro.apelido,
        role: membro.role,
        guildId: membro.guildId,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      membro: {
        id: membro.id,
        apelido: membro.apelido,
        role: membro.role,
        guildId: membro.guildId,
      },
    });
  } catch (error) {
    console.error("Erro no login de membro:", error);
    res.status(500).json({ error: "Erro no login" });
  }
});

module.exports = router;
