const bcrypt = require("bcryptjs");
const prisma = require("../prismaClient");

async function authRoutes(fastify) {
  // Registro
  fastify.post("/register", async (req, reply) => {
    const { username, password, role } = req.body;

    if (!username || !password)
      return reply.code(400).send({ error: "Faltan datos obligatorios" });

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return reply.code(400).send({ error: "Usuario ya existe" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashed, role: role || "user" },
    });

    reply.send({ message: "Usuario creado", userId: user.id });
  });

  // Login
  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return reply.code(401).send({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send({ error: "Contraseña incorrecta" });

    const token = fastify.jwt.sign({
      userId: user.id,
      role: user.role,
    });

    reply.send({ token });
  });
}

module.exports = authRoutes;
