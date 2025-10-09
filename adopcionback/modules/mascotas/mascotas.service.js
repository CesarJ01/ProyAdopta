// modules/mascota/mascota.service.js
const prisma = require("../../prisma/prismaClient");
const { CreateMascotaDto } = require("./mascotas.dto");

class MascotaService {
  async create(data, userId) {
    const dto = new CreateMascotaDto(data);
    return prisma.mascota.create({
      data: {
        ...dto,
        creadoPorId: userId,
      },
    });
  }

  async findAll() {
    return prisma.mascota.findMany({ include: { creadoPor: true } });
  }

  async findOne(id) {
    return prisma.mascota.findUnique({
      where: { id: Number(id) },
      include: { creadoPor: true },
    });
  }

  async remove(id) {
    return prisma.mascota.delete({ where: { id: Number(id) } });
  }
}

module.exports = new MascotaService();
