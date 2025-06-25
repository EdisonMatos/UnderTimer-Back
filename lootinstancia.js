const express = require("express");
const router = express.Router();
const prisma = require("./src/prisma");

// CREATE
router.post("/lootinstancia", async (req, res) => {
  const { name, updatedby, preco, observacao, instanciaId } = req.body;

  if (!instanciaId) {
    return res.status(400).json({ error: "instanciaId é obrigatório." });
  }

  try {
    const loot = await prisma.lootInstancia.create({
      data: {
        name,
        updatedby,
        preco,
        observacao,
        instanciaId,
      },
    });
    res.status(201).json(loot);
  } catch (error) {
    console.error("Erro ao criar loot da instância:", error);
    res.status(500).json({ error: "Erro ao criar loot da instância" });
  }
});

// READ ALL
router.get("/lootinstancia", async (req, res) => {
  try {
    const loots = await prisma.lootInstancia.findMany();
    res.json(loots);
  } catch (error) {
    console.error("Erro ao buscar loots da instância:", error);
    res.status(500).json({ error: "Erro ao buscar loots da instância" });
  }
});

// READ ONE
router.get("/lootinstancia/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const loot = await prisma.lootInstancia.findUnique({
      where: { id },
    });

    if (!loot) {
      return res
        .status(404)
        .json({ error: "Loot da instância não encontrado" });
    }

    res.json(loot);
  } catch (error) {
    console.error("Erro ao buscar loot da instância:", error);
    res.status(500).json({ error: "Erro ao buscar loot da instância" });
  }
});

// UPDATE
router.put("/lootinstancia/:id", async (req, res) => {
  const { id } = req.params;
  const { name, updatedby, preco, observacao } = req.body;

  try {
    const loot = await prisma.lootInstancia.update({
      where: { id },
      data: {
        name,
        updatedby,
        preco,
        observacao,
      },
    });
    res.json(loot);
  } catch (error) {
    console.error("Erro ao atualizar loot da instância:", error);
    res.status(500).json({ error: "Erro ao atualizar loot da instância" });
  }
});

// DELETE
router.delete("/lootinstancia/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.lootInstancia.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar loot da instância:", error);
    res.status(500).json({ error: "Erro ao deletar loot da instância" });
  }
});

module.exports = router;
