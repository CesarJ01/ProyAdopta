const prisma = require("../../prisma/prismaClient");
const bcrypt = require("bcryptjs");

class AuthController {
  // POST /register
  async register(req, reply) {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return reply.status(400).send({ error: "Faltan username o password" });
    }

    try {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing)
        return reply.status(400).send({ error: "Usuario ya existe" });

      const hashed = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { username, password: hashed, role: role || "user" },
      });

      return reply.send({ message: "Usuario creado", userId: user.id });
    } catch (err) {
      return reply.status(500).send({ error: err.message });
    }
  }

  // POST /login
  async login(req, reply) {
    const { username, password } = req.body;

    if (!username || !password) {
      return reply.status(400).send({ error: "Faltan username o password" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
      return reply.status(401).send({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return reply.status(401).send({ error: "Contraseña incorrecta" });

    // ✅ Usar fastify.jwt.sign() en lugar de req.server.jwt
    const token = await req.server.jwt.signAsync({
      userId: user.id,
      role: user.role,
    });

    return reply.send({ token });
  }
}

module.exports = new AuthController();
