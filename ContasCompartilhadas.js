const express = require("express");
const router = express.Router();
const prisma = require("./src/prisma");

// CREATE
router.post("/contascompartilhadas", async (req, res) => {
  const {
    descricao,
    usuario,
    senha,
    situacaoespecial,
    updateAt,
    observacao,
    guildId,
  } = req.body;

  if (!guildId) {
    return res.status(400).json({ error: "guildId é obrigatório." });
  }

  try {
    const conta = await prisma.contaCompartilhada.create({
      data: {
        descricao,
        usuario,
        senha,
        situacaoespecial,
        observacao,
        guildId,
        updateAt,
      },
    });
    res.status(201).json(conta);
  } catch (error) {
    console.error("Erro ao criar conta compartilhada:", error);
    res.status(500).json({ error: "Erro ao criar conta compartilhada" });
  }
});

// READ ALL
router.get("/contascompartilhadas", async (req, res) => {
  try {
    const contas = await prisma.contaCompartilhada.findMany();
    res.json(contas);
  } catch (error) {
    console.error("Erro ao buscar contas compartilhadas:", error);
    res.status(500).json({ error: "Erro ao buscar contas compartilhadas" });
  }
});

// READ ONE
router.get("/contascompartilhadas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const conta = await prisma.contaCompartilhada.findUnique({
      where: { id },
    });

    if (!conta) {
      return res
        .status(404)
        .json({ error: "Conta compartilhada não encontrada" });
    }

    res.json(conta);
  } catch (error) {
    console.error("Erro ao buscar conta compartilhada:", error);
    res.status(500).json({ error: "Erro ao buscar conta compartilhada" });
  }
});

// UPDATE
router.put("/contascompartilhadas/:id", async (req, res) => {
  const { id } = req.params;
  const { descricao, usuario, senha, situacaoespecial, updateAt, observacao } =
    req.body;

  try {
    const conta = await prisma.contaCompartilhada.update({
      where: { id },
      data: {
        descricao,
        usuario,
        senha,
        situacaoespecial,
        observacao,
        updateAt,
      },
    });
    res.json(conta);
  } catch (error) {
    console.error("Erro ao atualizar conta compartilhada:", error);
    res.status(500).json({ error: "Erro ao atualizar conta compartilhada" });
  }
});

// DELETE
router.delete("/contascompartilhadas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.contaCompartilhada.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar conta compartilhada:", error);
    res.status(500).json({ error: "Erro ao deletar conta compartilhada" });
  }
});

module.exports = router;
