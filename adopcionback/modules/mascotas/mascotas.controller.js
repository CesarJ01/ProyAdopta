const mascotaService = require("./mascotas.service");

class MascotaController {
  async create(req, reply) {
    try {
      const mascota = await mascotaService.create(req.body, req.user.userId);
      reply.code(201).send(mascota);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  }

  async findAll(req, reply) {
    try {
      const mascotas = await mascotaService.findAll();
      reply.send(mascotas);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  }

  async findOne(req, reply) {
    try {
      const mascota = await mascotaService.findOne(req.params.id);
      if (!mascota)
        return reply.code(404).send({ error: "Mascota no encontrada" });
      reply.send(mascota);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  }

  async remove(req, reply) {
    try {
      const mascota = await mascotaService.remove(req.params.id);
      reply.send(mascota);
    } catch (err) {
      reply.code(500).send({ error: err.message });
    }
  }
}

module.exports = new MascotaController();
