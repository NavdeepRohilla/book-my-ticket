import crypto from "crypto";
import { readCollection, writeCollection } from "../config/db.js";

const USERS_COLLECTION = "users";

export const findUserByEmail = async (email) => {
  const users = await readCollection(USERS_COLLECTION);
  return users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

export const findUserById = async (userId) => {
  const users = await readCollection(USERS_COLLECTION);
  return users.find((user) => user.id === userId);
};

export const createUser = async ({ name, email, passwordHash }) => {
  const users = await readCollection(USERS_COLLECTION);

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeCollection(USERS_COLLECTION, users);

  return newUser;
};
