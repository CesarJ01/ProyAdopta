// auth.dto.js
class RegisterUserDto {
  constructor({ username, password, role }) {
    this.username = username;
    this.password = password;
    this.role = role || "user";
  }
}

class LoginUserDto {
  constructor({ username, password }) {
    this.username = username;
    this.password = password;
  }
}

module.exports = { RegisterUserDto, LoginUserDto };
