const express = require("express"); // CORREÇÃO: aspas necessárias
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Ajuste o caminho conforme a localização real do prisma.js
const prisma = require("./src/prisma");

app.get("/", async (req, res) => {
  try {
    const creatures = await prisma.creature.findMany();
    res.json(creatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar criaturas" });
  }
});

app.listen(3001, () => {
  console.log("API iniciada na porta 3001");
});
