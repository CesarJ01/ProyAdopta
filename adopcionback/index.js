require("dotenv").config();
const fastify = require("fastify")({ logger: { level: "warn" } });
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
    reply.code(400).send({ error: "Token inválido o expirado" });
  }
});

// Verificar que el usuario auth sea dueño de la mascota
const checkOwner = async (request, reply) => {
  const petId = parseInt(request.params.id); // ID de pet de la URL
  const userId = request.user.userId; // ID del token JWT

  const pet = await prisma.mascota.findUnique({ where: { id: petId } });

  if (!pet) {
    return reply.status(404).send({ error: "Mascota no encontrada" });
  }

  if (pet.userId !== userId) {
    return reply
      .status(403)
      .send({ error: "No tienes permiso para modificar esta mascota" });
  }
};

//? ------RUTAS DE AUTENTICACIÓN------

// Registro
fastify.post("/auth/register", async (req, reply) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return reply
      .status(400)
      .send({ error: "Username y password son requeridos" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed },
    });

    const token = fastify.jwt.sign({ userId: user.id });
    reply.code(201).send({ token });
  } catch (error) {
    if (error.code === "P2002") {
      return reply
        .status(409)
        .send({ error: "El nombre de usuario ya está en uso." });
    }
    return reply.status(500).send({ error: "Error al crear el usuario" });
  }

  return { message: "Usuario creado", userId: user.id };
});

// Login
fastify.post("/auth/login", async (req, reply) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return reply
      .status(400)
      .send({ error: "Username y password son requeridos" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
      return reply
        .status(401)
        .send({ error: "Usuario o contraseña incorrectos" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return reply
        .status(401)
        .send({ error: "Usuario o contraseña incorrectos" });

    const token = fastify.jwt.sign({ userId: user.id });
    return reply.status(200).send({ token });
  } catch (error) {
    return reply.status(500).send({ error: "Error en el proceso de login" });
  }
});


//? ------RUTAS PÚBLICAS PARA HOMEPAGE------

// Ruta para obtener todas las mascotas publicadas
fastify.get("/pets", async (request, reply) => {
  try {
    const mascotas = await prisma.mascota.findMany({
      where: { estadoPublicacion: true },
    });
    return reply.code(200).send(mascotas);
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send({ error: "Fallo al obtener el listado de mascotas." });
  }
});

//? ------RUTAS PROTEGIDAS PARA DASHBOARD------

// Ruta para obtener las mascotas del usuario autenticado
fastify.get(
  "/pets/user",
  { preHandler: [fastify.authenticate] },
  async (req, reply) => {
    const userId = req.user.userId; // ID del token JWT

    try {
      const userPets = await prisma.mascota.findMany({ where: { userId } });
      return reply.code(200).send(userPets);
    } catch (error) {
      return reply
        .code(500)
        .send({ error: "Error al obtener las mascotas del usuario" });
    }
  }
);

//? ------CRUD DE MASCOTAS PROTEGIDO------

// Ruta para obtener una mascota por ID
fastify.get(
  "/pets/:id",
  { preHandler: [fastify.authenticate, checkOwner] },
  async (req, reply) => {
    const petId = parseInt(req.params.id);

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
  }
);

// Ruta para crear una nueva mascota
fastify.post(
  "/pets",
  { preHandler: [fastify.authenticate] },
  async (req, reply) => {
    console.log("📦 Body recibido en /pets:", req.body);
    console.log("👤 Usuario autenticado:", req.user);
    const {
      nombre,
      especie,
      descripcion,
      edad,
      raza,
      fotoAnimal,
      estadoPublicacion,
    } = req.body;
    const userId = req.user.userId; // ID del token JWT

    if (!nombre || !especie) {
      return reply
        .status(400)
        .send({ error: "Nombre y especie son requeridos" });
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
          userId: userId,
        },
      });
      return reply.code(201).send(newPet);
    } catch (error) {
      return reply.code(500).send({ error: "Error al crear la mascota" });
    }
  }
);

// Ruta para actualizar una mascota por ID
fastify.put(
  "/pets/:id",
  { preHandler: [fastify.authenticate, checkOwner] },
  async (req, reply) => {
    const petId = parseInt(req.params.id);
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
  }
);

// Ruta para eliminar una mascota por ID
fastify.delete(
  "/pets/:id",
  { preHandler: [fastify.authenticate, checkOwner] },
  async (req, reply) => {
    const petId = parseInt(req.params.id);

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
  }
);

fastify.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" });
