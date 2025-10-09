// modules/auth/jwt.plugin.js
const fp = require("fastify-plugin");
const fastifyJwt = require("@fastify/jwt");

module.exports = fp(async (fastify, opts) => {
  // Registrar plugin JWT
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "supersecret",
  });

  // Decorador para rutas protegidas
  fastify.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
      // req.user ya tendrá userId y role si tu payload lo incluye
    } catch (err) {
      reply.code(401).send({ error: "No autorizado" });
    }
  });
});
