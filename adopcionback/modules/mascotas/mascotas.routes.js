// modules/mascotas/mascotas.routes.js
const mascotaController = require("./mascotas.controller");

async function mascotaRoutes(fastify) {
  // wrapper que llama a authorize correctamente
  const onlyAdmin = (req, reply) => fastify.authorize(["admin"])(req, reply);

  fastify.post(
    "/mascotas",
    { preHandler: [fastify.authenticate, onlyAdmin] },
    mascotaController.create
  );

  fastify.get(
    "/mascotas",
    { preHandler: [fastify.authenticate, onlyAdmin] },
    mascotaController.findAll
  );

  fastify.get(
    "/mascotas/:id",
    { preHandler: [fastify.authenticate] },
    mascotaController.findOne
  );

  fastify.delete(
    "/mascotas/:id",
    { preHandler: [fastify.authenticate, onlyAdmin] },
    mascotaController.remove
  );
}

module.exports = mascotaRoutes;
