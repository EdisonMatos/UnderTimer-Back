const express = require("express"); // CORREÇÃO: aspas necessárias
const contasCompartilhadasRoutes = require("./ContasCompartilhadas");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://under-timer-front.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

const authRoutes = require("./authRoutes");
const adminRoutes = require("./admins");
const guildRoutes = require("./guilds");
const membroRoutes = require("./membros");

app.use(express.json());
app.use(authRoutes);
app.use(contasCompartilhadasRoutes);
app.use(adminRoutes);
app.use(guildRoutes);
app.use(membroRoutes);

const prisma = require("./src/prisma");

// GET ALL CREATURES
app.get("/", async (req, res) => {
  try {
    const creatures = await prisma.creature.findMany();
    res.json(creatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar criaturas" });
  }
});

// UPDATE CREATURE
app.put("/edit", async (req, res) => {
  const {
    id,
    lastDeath,
    updatedby,
    type, // novo campo opcional
    tier, // novo campo opcional
    name, // novo campo opcional
    map, // novo campo opcional
    respawn, // novo campo opcional
    spriteUrl, // novo campo opcional
  } = req.body;

  try {
    const updatedCreature = await prisma.creature.update({
      where: { id },
      data: {
        // Campos antigos
        lastDeath,
        updatedby,

        // Novos campos (todos opcionais - só atualizam se vierem no body)
        ...(type !== undefined && { type }),
        ...(tier !== undefined && { tier }),
        ...(name !== undefined && { name }),
        ...(map !== undefined && { map }),
        ...(respawn !== undefined && { respawn }),
        ...(spriteUrl !== undefined && { spriteUrl }),
      },
    });

    res.json(updatedCreature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar a criatura" });
  }
});

// CREATE CREATURE
app.post("/creatures", async (req, res) => {
  const {
    type,
    tier,
    name,
    map,
    respawn,
    spriteUrl,
    lastDeath,
    updatedby,
    guildId,
  } = req.body;

  try {
    const creature = await prisma.creature.create({
      data: {
        type,
        tier,
        name,
        map,
        respawn,
        spriteUrl,
        lastDeath: new Date(lastDeath),
        updatedby,
        guildId,
      },
    });
    res.status(201).json(creature);
  } catch (error) {
    console.error("Erro ao criar criatura:", error);
    res.status(500).json({ error: "Erro ao criar criatura" });
  }
});

// READ ONE CREATURE
app.get("/creatures/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const creature = await prisma.creature.findUnique({
      where: { id },
    });

    if (!creature) {
      return res.status(404).json({ error: "Criatura não encontrada" });
    }

    res.json(creature);
  } catch (error) {
    console.error("Erro ao buscar criatura:", error);
    res.status(500).json({ error: "Erro ao buscar criatura" });
  }
});

// DELETE CREATURE
app.delete("/creatures/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.creature.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar criatura:", error);
    res.status(500).json({ error: "Erro ao deletar criatura" });
  }
});

// ------------------
// ROTAS CRUD PARA /instancias
// ------------------

// CREATE
app.post("/instancias", async (req, res) => {
  const { name, spriteUrl, last, guildId, updatedby } = req.body;

  if (!guildId) {
    return res.status(400).json({ error: "guildId é obrigatório." });
  }

  try {
    const instancia = await prisma.instancia.create({
      data: {
        name,
        spriteUrl,
        last: new Date(last),
        updatedby,
        guildId,
      },
    });
    res.status(201).json(instancia);
  } catch (error) {
    console.error("Erro ao criar instância:", error);
    res.status(500).json({ error: "Erro ao criar instância" });
  }
});

// READ ALL
app.get("/instancias", async (req, res) => {
  try {
    const instancias = await prisma.instancia.findMany({
      include: {
        membros: true,
      },
    });
    res.json(instancias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar instâncias" });
  }
});

// READ ONE
app.get("/instancias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const instancia = await prisma.instancia.findUnique({
      where: { id },
    });

    if (!instancia) {
      return res.status(404).json({ error: "Instância não encontrada" });
    }

    res.json(instancia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar instância" });
  }
});

// UPDATE
app.put("/instancias/:id", async (req, res) => {
  const { id } = req.params;
  const { name, spriteUrl, last } = req.body;

  try {
    const instancia = await prisma.instancia.update({
      where: { id },
      data: {
        name,
        spriteUrl,
        last: last ? new Date(last) : undefined,
      },
    });
    res.json(instancia);
  } catch (error) {
    console.error("Erro ao atualizar instância:", error);
    res.status(500).json({ error: "Erro ao atualizar instância" });
  }
});

// DELETE
app.delete("/instancias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.instancia.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar instância" });
  }
});

// ------------------
// ROTAS CRUD PARA /membrosinstancia
// ------------------

// CREATE
app.post("/membrosinstancia", async (req, res) => {
  const { name, role, instanciaId } = req.body;

  try {
    const membro = await prisma.membrosInstancia.create({
      data: {
        name,
        role,
        instancia: instanciaId ? { connect: { id: instanciaId } } : undefined,
      },
    });
    res.status(201).json(membro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar membro da instância" });
  }
});

// READ ALL
app.get("/membrosinstancia", async (req, res) => {
  try {
    const membros = await prisma.membrosInstancia.findMany();
    res.json(membros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar membros da instância" });
  }
});

// READ ONE
app.get("/membrosinstancia/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const membro = await prisma.membrosInstancia.findUnique({
      where: { id },
    });

    if (!membro) {
      return res
        .status(404)
        .json({ error: "Membro da instância não encontrado" });
    }

    res.json(membro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar membro da instância" });
  }
});

// UPDATE
app.put("/membrosinstancia/:id", async (req, res) => {
  const { id } = req.params;
  const { name, role, instanciaId } = req.body;

  try {
    const membro = await prisma.membrosInstancia.update({
      where: { id },
      data: {
        name,
        role,
        instancia: instanciaId ? { connect: { id: instanciaId } } : undefined,
      },
    });
    res.json(membro);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar membro da instância" });
  }
});

// DELETE
app.delete("/membrosinstancia/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.membrosInstancia.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar membro da instância" });
  }
});

// API RAGNA PROXY

// Proxy para RagnAPI - contorna o problema de CORS
app.get("/proxy/monster/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://ragnapi.com/api/v1/old-times/monsters/${id}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Erro ao buscar dados da RagnAPI:", error.message);
    res.status(500).json({ error: "Erro ao consultar a RagnAPI" });
  }
});

app.listen(3001, () => {
  console.log("API iniciada na porta 3001");
});
