const bcrypt = require("bcryptjs");
const prisma = require("../../prismaClient");

class AuthService {
  async register(data) {
    const { username, password, role } = data;

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new Error("El usuario ya existe");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashed, role },
    });

    return user;
  }

  async login(data) {
    const { username, password } = data;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) throw new Error("Usuario no encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Contraseña incorrecta");

    return user;
  }
}

module.exports = new AuthService();
