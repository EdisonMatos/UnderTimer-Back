const express = require("express"); // CORREÇÃO: aspas necessárias
const cors = require("cors");
const dotenv = require("dotenv");

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
app.use(express.json());
app.use(authRoutes);

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

app.put("/edit", async (req, res) => {
  const { id, lastDeath, updatedby } = req.body;

  try {
    const updatedCreature = await prisma.creature.update({
      where: { id },
      data: { lastDeath, updatedby },
    });
    res.json(updatedCreature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar a criatura" });
  }
});

// ROTAS CRUD PARA /instancias

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
        guildId, // incluído corretamente aqui
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
        membros: true, // Isso é essencial para trazer os membros da instância
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

// ROTAS CRUD PARA /membrosinstancia

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

app.listen(3001, () => {
  console.log("API iniciada na porta 3001");
});
