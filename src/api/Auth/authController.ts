/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { AuthPayload, AuthService } from "./authService";
import { LoginUserDTO, RegisterUserDTO } from "./dto";
import { plainToClass } from "class-transformer";
import { validate } from "../../utils/formatter";
import axios from "axios";
import { UserType } from "@prisma/client";

export type GoogleAuthPayload = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
};

const authService: AuthService = new AuthService();

export default class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const args = plainToClass(RegisterUserDTO, {
        ...req.params,
        ...req.query,
        ...req.body,
      });
      const errors: unknown = validate(args);

      if (errors instanceof Array || typeof errors === "string") {
        throw new Error(errors as any);
      } else {
        const user: AuthPayload = await authService
          .signup(args.email, args.password, args.fullname, args.mobile)
          .catch((err) => err);

        if (user instanceof Error) {
          throw new Error(user.message);
        } else {
          res.cookie(
            `__${user.type.toLowerCase()}AccessToken`,
            user.accessToken
          );
          res.status(200).send({
            success: true,
          });
          return;
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const args = plainToClass(LoginUserDTO, {
        ...req.params,
        ...req.query,
        ...req.body,
      });

      const errors: unknown = validate(args);

      if (errors instanceof Array || typeof errors === "string") {
        throw new Error(errors as any);
      } else {
        const user: AuthPayload = await authService.login(
          args.email,
          args.password
        );

        res.cookie(`__${user.type.toLowerCase()}AccessToken`, user.accessToken);
        res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url);
  }

  async googleLogin(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query;

    try {
      // Exchange authorization code for access token
      const { data: _data } = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          redirect_uri: process.env.REDIRECT_URI,
          grant_type: "authorization_code",
        }
      );

      const { access_token } = _data;

      // Use access_token or id_token to fetch user profile
      const { data } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const profile = data as GoogleAuthPayload;

      const user: AuthPayload = await authService
        .signup(
          profile.email,
          undefined,
          profile.name,
          undefined,
          profile.picture,
          UserType.User,
          profile.id
        )
        .catch((err) => err);

      if (user instanceof Error) {
        throw new Error(user.message);
      }

      // Code to handle user authentication and retrieval using the profile data

      res.redirect("/");
    } catch (error) {
      console.log("errorrrr", error);

      next(error);
    }
  }
}
