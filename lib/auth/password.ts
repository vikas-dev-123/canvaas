import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string) => bcrypt.hash(password, SALT_ROUNDS);

export const verifyPassword = async (password: string, hash: string) => bcrypt.compare(password, hash);

const STRONG_PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const isStrongPassword = (password: string) => STRONG_PASSWORD_RE.test(password);
