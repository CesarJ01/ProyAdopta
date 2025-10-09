const fastify = require("fastify")({ logger: true });
require("dotenv").config();

// Plugins
const jwtPlugin = require("./modules/auth/jwt.plugin");
const rolesPlugin = require("./modules/auth/roles.plugin");

// Rutas
const authRoutes = require("./modules/auth/auth.routes");
const mascotaRoutes = require("./modules/mascotas/mascotas.routes");

async function main() {
  // Registrar JWT primero
  await fastify.register(jwtPlugin);

  // Registrar plugin de roles después
  await fastify.register(rolesPlugin);

  // Registrar rutas auth
  await fastify.register(authRoutes);

  // Registrar rutas mascotas
  await fastify.register(async function (fastify) {
    await fastify.register(mascotaRoutes);
  });

  // Servidor
  await fastify.listen({ port: process.env.PORT || 4000, host: "0.0.0.0" });
  console.log("Servidor corriendo en http://localhost:4000");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
