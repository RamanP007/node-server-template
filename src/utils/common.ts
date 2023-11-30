import * as crypto from "node:crypto";

export class UtilsService {
  generateSalt = (length?: number) => {
    return crypto.randomBytes(length || 10).toString("hex");
  };

  generateHash = (salt: string, password: string, length?: number) => {
    return crypto.scryptSync(password, salt, length || 10).toString("hex");
  };

  hashPassword = (password: string, length?: number) => {
    const salt = this.generateSalt(length);
    const hash = this.generateHash(salt, password, length);
    return { salt, hash };
  };

  comparePassword = (
    password: string,
    passwordHash: string,
    passwordSalt: string
  ) => {
    const hash = this.generateHash(passwordSalt, password);

    if (hash === passwordHash) {
      return true;
    } else {
      return false;
    }
  };
}
