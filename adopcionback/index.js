const fastify = require("fastify")({ logger: true });
const jwt = require("@fastify/jwt");
const prisma = require("./prismaClient");
const bcrypt = require("bcrypt");

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

fastify.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" });
