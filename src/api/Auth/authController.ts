import { Request, Response } from "express";
import { AuthPayload, AuthService } from "./authService";
import { LoginUserDTO, RegisterUserDTO } from "./dto";
import { plainToClass } from "class-transformer";
import { validate } from "../../utils/formatter";

const authService: AuthService = new AuthService();

export default class AuthController {
  async signup(req: Request, res: Response): Promise<void> {
    const args = plainToClass(RegisterUserDTO, {
      ...req.params,
      ...req.query,
      ...req.body,
    });
    const errors: unknown = validate(args);

    if (errors instanceof Array || typeof errors === "string") {
      res.status(500).send({ error: errors });
      return;
    } else {
      const user: AuthPayload = await authService
        .signup(args.email, args.password, args.fullname, args.mobile)
        .catch((err) => err);

      if (user instanceof Error) {
        res.status(500).send({ error: user.message });
      } else {
        res.status(200).send({
          [`__${user.type.toLowerCase()}AccessToken`]: user.accessToken,
          __type: user.type,
        });
        return;
      }
    }
  }

  async signIn(req: Request, res: Response) {
    const args = plainToClass(LoginUserDTO, {
      ...req.params,
      ...req.query,
      ...req.body,
    });
    const errors: unknown = validate(args);

    if (errors instanceof Array || typeof errors === "string") {
      res.status(500).send({ error: errors });
      return;
    } else {
      const user: AuthPayload = await authService
        .login(args.email, args.password)
        .catch((err) => err);

      if (user instanceof Error) {
        res.status(500).send({ error: user.message });
      } else {
        res.status(200).send({
          [`__${user.type.toLowerCase()}AccessToken`]: user.accessToken,
          __type: user.type,
        });
        return;
      }
    }
  }
}
