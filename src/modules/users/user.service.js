import * as userRepository from "./user.repository.js";
import bcrypt from "bcrypt";
export const create = async (payload) => {
  const existingUser = await userRepository.findByEmail(payload.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // ✅ PASSWORD HASHING (IMPORTANT)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  return userRepository.create(userData);

  // Note: duplicate return removed – createUser now returns hashed password payload
};

export const getAllUsers = async (query) => {
  return userRepository.getAllUsers(query);
};

export const getUserById = async (id) => {
  return userRepository.findById(id);
};

export const updateUser = async (id, data) => {
  return userRepository.update(id, data);
};

export const deleteUser = async (id) => {
  return userRepository.remove(id);
};

export const softDeleteUser = async (id) => {
  return userRepository.softDelete(id);
};