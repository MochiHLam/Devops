const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "shopvn_dev_secret_change_in_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const AuthService = {
  generateToken: (user) => {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );
  },

  register: async ({ name, email, password, role = "user" }) => {
    const existing = await UserModel.findByEmail(email);
    if (existing) throw Object.assign(new Error("Email already registered"), { status: 409 });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, password_hash, role });
    const token = AuthService.generateToken(user);
    return { user, token };
  },

  login: async ({ email, password }) => {
    const user = await UserModel.findByEmail(email);
    if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401 });
    if (!user.is_active) throw Object.assign(new Error("Account is disabled"), { status: 403 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw Object.assign(new Error("Invalid credentials"), { status: 401 });

    const { password_hash, ...safeUser } = user;
    const token = AuthService.generateToken(safeUser);
    return { user: safeUser, token };
  },
};

module.exports = AuthService;
