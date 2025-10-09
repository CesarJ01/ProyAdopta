const prisma = require("../prismaClient");

async function mascotasRoutes(fastify) {
  // Solo admin puede crear mascotas
  fastify.post(
    "/mascotas",
    { preHandler: [fastify.authenticate] },
    async (req, reply) => {
      const { userId, role } = req.user;

      if (role !== "admin")
        return reply
          .code(403)
          .send({ error: "Solo los administradores pueden crear mascotas" });

      const {
        nombre,
        descripcion,
        raza,
        especie,
        edad,
        fotoAnimal,
        perfilMedico,
      } = req.body;

      if (!nombre || !raza || !especie || !edad)
        return reply.code(400).send({ error: "Datos incompletos" });

      const mascota = await prisma.mascota.create({
        data: {
          nombre,
          descripcion,
          raza,
          especie,
          edad: Number(edad),
          fotoAnimal,
          perfilMedico,
          creadoPorId: userId,
        },
      });

      reply.send({ message: "Mascota registrada", mascota });
    }
  );

  // Todos los usuarios pueden ver mascotas
  fastify.get("/mascotas", async (req, reply) => {
    const mascotas = await prisma.mascota.findMany({
      include: { creadoPor: { select: { username: true } } },
    });
    reply.send(mascotas);
  });
}

module.exports = mascotasRoutes;
