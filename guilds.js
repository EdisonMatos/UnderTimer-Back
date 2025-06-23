const express = require("express");
const router = express.Router();
const prisma = require("./src/prisma");

// CREATE
router.post("/guilds", async (req, res) => {
  const { spriteUrl, adminId } = req.body;
  try {
    const guild = await prisma.guild.create({
      data: {
        spriteUrl,
        admin: { connect: { id: adminId } },
      },
    });
    res.status(201).json(guild);
  } catch (error) {
    console.error("Erro ao criar guild:", error);
    res.status(500).json({ error: "Erro ao criar guild" });
  }
});

// READ ALL
router.get("/guilds", async (req, res) => {
  try {
    const guilds = await prisma.guild.findMany({
      include: {
        admin: true,
        membros: true,
        instancias: true,
        monsters: true,
        ContaCompartilhadas: true,
      },
    });
    res.json(guilds);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar guilds" });
  }
});

// READ ONE
router.get("/guilds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const guild = await prisma.guild.findUnique({
      where: { id },
      include: {
        admin: true,
        membros: true,
        instancias: true,
        monsters: true,
        ContaCompartilhadas: true,
      },
    });
    if (!guild) return res.status(404).json({ error: "Guild não encontrada" });
    res.json(guild);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar guild" });
  }
});

// UPDATE
router.put("/guilds/:id", async (req, res) => {
  const { id } = req.params;
  const { spriteUrl, adminId } = req.body;
  try {
    const guild = await prisma.guild.update({
      where: { id },
      data: {
        spriteUrl,
        admin: adminId ? { connect: { id: adminId } } : undefined,
      },
    });
    res.json(guild);
  } catch (error) {
    console.error("Erro ao atualizar guild:", error);
    res.status(500).json({ error: "Erro ao atualizar guild" });
  }
});

// DELETE
router.delete("/guilds/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.guild.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar guild" });
  }
});

module.exports = router;
