// modules/auth/auth.routes.js
const bcrypt = require("bcryptjs");
const prisma = require("../../prisma/prismaClient");

module.exports = async function (fastify, opts) {
  // Registro de usuario
  fastify.post("/register", async (req, reply) => {
    const { username, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hash, role },
    });

    reply.send({ message: "Usuario creado", user });
  });

  // Login
  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return reply.code(400).send({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(400).send({ error: "Contraseña incorrecta" });

    // Firmar JWT usando el decorador
    const token = fastify.jwt.sign({ userId: user.id, role: user.role });

    reply.send({ message: "Login exitoso", token });
  });
};
