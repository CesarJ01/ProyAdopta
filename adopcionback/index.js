require("dotenv").config();
const fastify = require("fastify")({ logger: true });
const jwt = require("@fastify/jwt");
const prisma = require("./prismaClient");
const bcrypt = require("bcrypt");
const cors = require("@fastify/cors");

fastify.addContentTypeParser(
  "text/plain",
  { parseAs: "string" },
  function (req, body, done) {
    try {
      const json = JSON.parse(body);
      done(null, json);
    } catch (err) {
      done(err, undefined);
    }
  }
);

fastify.register(jwt, { secret: process.env.JWT_SECRET });
fastify.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

fastify.decorate("authenticate", async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: "Token inválido o expirado" });
  }
});

// Registro
fastify.post("/register", async (req, reply) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply
      .status(400)
      .send({ error: "Username y password son requeridos" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, password: hashed },
  });

  return { message: "Usuario creado", userId: user.id };
});

// Login
fastify.post("/login", async (req, reply) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return reply.status(401).send({ error: "Usuario no encontrado" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return reply.status(401).send({ error: "Contraseña incorrecta" });

  const token = fastify.jwt.sign({ userId: user.id });
  return { token };
});

// Ruta protegida
fastify.get("/dashboard", { preHandler: [fastify.authenticate] }, async () => ({
  secret: "Solo usuarios autenticados pueden ver esto!",
}));

// Ruta para obtener todas las mascotas disponibles
fastify.get("/pets", async (req, reply) => {
  const { all } = req.query;

  // Si /pets?all=true, traemos todas las mascotas, si no, solo las publicadas
  let whereClause = { estadoPublicacion: true };
  if (all === "true") {
    whereClause = {};
  }

  try {
    const pets = await prisma.mascota.findMany({
      where: whereClause,
    });
    return reply.code(200).send(pets);
  } catch (error) {
    return reply.code(500).send({ error: "Error al obtener mascotas" });
  }
});

// Ruta para obtener una mascota por ID
fastify.get("/pets/:id", async (req, reply) => {
  const { id } = req.params;
  const petId = parseInt(id);

  if (isNaN(petId)) {
    return reply.status(400).send({ error: "ID de mascota inválido" });
  }

  try {
    const pet = await prisma.mascota.findUnique({ where: { id: petId } });
    if (!pet) {
      return reply.status(404).send({ error: "Mascota no encontrada" });
    }
    return reply.code(200).send(pet);
  } catch (error) {
    return reply.code(500).send({ error: "Error al obtener la mascota" });
  }
});

// Ruta para crear una nueva mascota
fastify.post("/pets", async (req, reply) => {
  const {
    nombre,
    especie,
    descripcion,
    edad,
    raza,
    fotoAnimal,
    estadoPublicacion,
  } = req.body;

  if (!nombre || !especie) {
    return reply.status(400).send({ error: "Nombre y especie son requeridos" });
  }

  try {
    const newPet = await prisma.mascota.create({
      data: {
        nombre,
        especie,
        descripcion,
        edad: edad ? parseInt(edad) : null,
        raza,
        fotoAnimal,
        estadoPublicacion,
      },
    });
    return reply.code(201).send(newPet);
  } catch (error) {
    return reply.code(500).send({ error: "Error al crear la mascota" });
  }
});

// Ruta para actualizar una mascota por ID
fastify.put("/pets/:id", async (req, reply) => {
  const { id } = req.params;
  const petId = parseInt(id);
  const updateData = req.body;

  if (isNaN(petId)) {
    return reply.status(400).send({ error: "ID de mascota inválido" });
  }

  try {
    const updatePet = await prisma.mascota.update({
      where: { id: petId },
      data: {
        ...updateData,
        edad: updateData.edad ? parseInt(updateData.edad) : undefined,
      },
    });
    return reply.code(200).send(updatePet);
  } catch (error) {
    // Por si no existe la ID
    if (error.code === "P2025") {
      return reply.status(404).send({ error: "Mascota no encontrada" });
    }
    return reply.code(500).send({ error: "Error al actualizar la mascota" });
  }
});

// Ruta para eliminar una mascota por ID
fastify.delete("/pets/:id", async (req, reply) => {
  const { id } = req.params;
  const petId = parseInt(id);
  if (isNaN(petId)) {
    return reply.status(400).send({ error: "ID de mascota inválido" });
  }

  try {
    await prisma.mascota.delete({ where: { id: petId } });
    return reply.code(204).send();
  } catch (error) {
    // Por si no existe la ID
    if (error.code === "P2025") {
      return reply.status(404).send({ error: "Mascota no encontrada" });
    }
    return reply.code(500).send({ error: "Error al eliminar la mascota" });
  }
});

fastify.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" });
