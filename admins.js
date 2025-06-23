const express = require("express");
const router = express.Router();
const prisma = require("./src/prisma");

// CREATE ADMIN
router.post("/admins", async (req, res) => {
  const { apelido, email, password, role, subscriptionStatus } = req.body;
  try {
    const admin = await prisma.admin.create({
      data: { apelido, email, password, role, subscriptionStatus },
    });
    res.status(201).json(admin);
  } catch (error) {
    console.error("Erro ao criar admin:", error);
    res.status(500).json({ error: "Erro ao criar admin" });
  }
});

// READ ALL
router.get("/admins", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar admins" });
  }
});

// READ ONE
router.get("/admins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) return res.status(404).json({ error: "Admin não encontrado" });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar admin" });
  }
});

// UPDATE
router.put("/admins/:id", async (req, res) => {
  const { id } = req.params;
  const { apelido, email, password, role, subscriptionStatus } = req.body;
  try {
    const admin = await prisma.admin.update({
      where: { id },
      data: { apelido, email, password, role, subscriptionStatus },
    });
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar admin" });
  }
});

// DELETE
router.delete("/admins/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.admin.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar admin" });
  }
});

module.exports = router;
