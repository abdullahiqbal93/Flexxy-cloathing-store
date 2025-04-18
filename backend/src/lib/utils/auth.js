import { env } from "../config.js";
import { handleError } from "./error-handle.js";
import bcrypt from "bcryptjs";
import { SignJWT, importPKCS8, jwtVerify } from "jose";
import { mainLogger } from "../logger/winston.js";

const algorithm = "RS256";
const { compare, genSalt, hash } = bcrypt;

export const hashUserPassword = async (password) => {
  try {
    const salt = await genSalt(env.SALT_FACTOR);
    return await hash(password, salt);
  } catch (error) {
    mainLogger.error("Error hashing user password:", error);
  }
};

export const compareUserPassword = async (password, hash) => {
  try {
    return await compare(password, hash);
  } catch (error) {
    mainLogger.error("Error comparing user password:", error);
  }
};

export const generateToken = async (payload) => {
  try {
    if (!env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }
    const pk = await importPKCS8(env.PRIVATE_KEY, algorithm);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: algorithm, publicKey: true })
      .setExpirationTime("1d")
      .setIssuedAt()
      .sign(pk);
  } catch (error) {
    mainLogger.error("Error generating token:", error);
    return handleError(error);
  }
};

export const verifyToken = async (token) => {
  try {
    if (!env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY environment variable is not set");
    }
    const pk = await importPKCS8(env.PRIVATE_KEY, algorithm);
    return await jwtVerify(token, pk);
  } catch (error) {
    mainLogger.error("Error verifying token:", error);
    return null;
  }
};

