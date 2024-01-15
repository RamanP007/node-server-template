import { UserType } from "@prisma/client";
import { UtilsService } from "../../utils/common";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();
const utilsService: UtilsService = new UtilsService();

export class UserService {
  async getByEmail(email: string) {
    return await prisma.user.findUniqueOrThrow({
      include: { UserMeta: true },
      where: { email: email.toLowerCase() },
    });
  }

  async getById(id: string) {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  }

  async getMetaById(userId: string) {
    return await prisma.userMeta.findUniqueOrThrow({
      where: { userId },
    });
  }

  async isEmailAlreadyExist(email: string, id?: string) {
    return (
      (await prisma.user.count({
        where: {
          email: email.toLowerCase(),
          NOT: {
            id,
          },
        },
      })) !== 0
    );
  }

  async isMobileAlreadyExist(mobile: string, id?: string) {
    return (
      (await prisma.user.count({
        where: {
          mobile,
          NOT: {
            id,
          },
        },
      })) !== 0
    );
  }

  async create(
    email: string,
    password?: string,
    fullname?: string,
    mobile?: string,
    profileImage?: string,
    type?: UserType,
    googleId?: string,
    facebookId?: string
  ) {
    let passwordHash, passwordMeta;
    if (password) {
      const { salt, hash } = utilsService.hashPassword(password, 10);
      passwordHash = hash;
      passwordMeta = salt;
    }
    return await prisma.user.create({
      data: {
        email,
        fullname,
        mobile,
        profileImage,
        type,
        UserMeta: {
          create: {
            passwordHash,
            passwordMeta,
            isEmailVerified: googleId || facebookId ? true : false,
            googleId,
            facebookId,
          },
        },
      },
    });
  }

  async createOrUpdateByGoogle(
    email: string,
    googleId: string,
    fullname?: string,
    profileImage?: string
  ) {
    const user = await this.getByEmail(email);
    if (user) {
      await prisma.userMeta.update({
        data: { googleId },
        where: {
          userId: user.id,
        },
      });
    } else {
      return await this.create(
        email,
        undefined,
        fullname,
        undefined,
        profileImage,
        UserType.User,
        googleId
      );
    }
  }

  async validateCredential(email: string, password: string) {
    const user = await this.getByEmail(email);
    if (user instanceof Error) {
      throw new Error(user.message);
    }

    const userMeta = await this.getMetaById(user.id);

    if (userMeta instanceof Error) {
      throw new Error(userMeta.message);
    }

    if (
      !utilsService.comparePassword(
        password,
        userMeta.passwordHash || "",
        userMeta.passwordMeta || ""
      )
    ) {
      throw new Error("Incorrect Password");
    }
    return user;
  }
}
