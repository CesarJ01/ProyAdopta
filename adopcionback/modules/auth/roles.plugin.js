async function rolesPlugin(fastify, options) {
  fastify.decorate("authorize", (allowedRoles = []) => {
    return async function (req, reply) {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return reply.code(403).send({ error: "No autorizado" });
      }
    };
  });
}

module.exports = rolesPlugin;
