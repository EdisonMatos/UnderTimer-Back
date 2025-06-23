const express = require("express");
const router = express.Router();
const prisma = require("./src/prisma");

// CREATE
router.post("/membros", async (req, res) => {
  const { apelido, password, role, guildId } = req.body;
  try {
    const membro = await prisma.membro.create({
      data: {
        apelido,
        password,
        role,
        guild: { connect: { id: guildId } },
      },
    });
    res.status(201).json(membro);
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    res.status(500).json({ error: "Erro ao criar membro" });
  }
});

// READ ALL
router.get("/membros", async (req, res) => {
  try {
    const membros = await prisma.membro.findMany({
      include: {
        guild: true,
      },
    });
    res.json(membros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar membros" });
  }
});

// READ ONE
router.get("/membros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const membro = await prisma.membro.findUnique({
      where: { id },
      include: { guild: true },
    });
    if (!membro)
      return res.status(404).json({ error: "Membro não encontrado" });
    res.json(membro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar membro" });
  }
});

// UPDATE
router.put("/membros/:id", async (req, res) => {
  const { id } = req.params;
  const { apelido, password, role, guildId } = req.body;
  try {
    const membro = await prisma.membro.update({
      where: { id },
      data: {
        apelido,
        password,
        role,
        guild: guildId ? { connect: { id: guildId } } : undefined,
      },
    });
    res.json(membro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar membro" });
  }
});

// DELETE
router.delete("/membros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.membro.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar membro" });
  }
});

module.exports = router;
