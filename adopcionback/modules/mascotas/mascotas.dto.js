class CreateMascotaDto {
  constructor({
    nombre,
    descripcion,
    raza,
    especie,
    edad,
    fotoAnimal,
    perfilMedico,
  }) {
    this.nombre = nombre;
    this.descripcion = descripcion || null;
    this.raza = raza;
    this.especie = especie;
    this.edad = Number(edad);
    this.fotoAnimal = fotoAnimal || null;
    this.perfilMedico = perfilMedico || null;
  }
}

module.exports = { CreateMascotaDto };
