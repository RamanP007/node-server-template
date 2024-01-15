import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { JwtAuthPayload } from "../common/types";
import { UserType } from "@prisma/client";

const verifyJWT = (token: string) => {
  return jwt.verify(
    token,
    process.env.JWT_TOKEN_SECRET as Secret
  ) as JwtAuthPayload;
};

const AuthenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"] || req.headers["cookie"];

  if (bearerHeader && typeof bearerHeader !== "undefined") {
    const bearer = req.headers["authorization"]
      ? bearerHeader.split(" ")
      : bearerHeader.split("=");

    const bearerToken = bearer[1];
    try {
      const payload = verifyJWT(bearerToken);

      req[req.method === "GET" ? "query" : "body"] = {
        ...req[req.method === "GET" ? "query" : "body"],
        ...(payload as JwtAuthPayload),
        token: bearerToken,
      };

      next();
    } catch (err) {
      res.status(403).send({ success: false, message: "Forbidden" });
      return;
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden" });
    return;
  }
};

const UserAuthenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"] || req.headers["cookie"];

  if (bearerHeader && typeof bearerHeader !== "undefined") {
    // const bearer = (bearerHeader as any).split("=");
    const bearer = req.headers["authorization"]
      ? bearerHeader.split(" ")
      : bearerHeader.split("=");

    const bearerToken = bearer[1];
    try {
      const payload = verifyJWT(bearerToken);

      if (payload.type === UserType.User) {
        req[req.method === "GET" ? "query" : "body"] = {
          ...req[req.method === "GET" ? "query" : "body"],
          ...(payload as JwtAuthPayload),
          token: bearerToken,
        };
        next();
      } else {
        res.status(401).send({ success: false, message: "Unauthorized" });
      }
    } catch (err) {
      res.status(403).send({ success: false, message: "Forbidden" });
      return;
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden" });
    return;
  }
};

const AdminAuthenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"] || req.headers["cookie"];

  if (bearerHeader && typeof bearerHeader !== "undefined") {
    // const bearer = (bearerHeader as any).split("=");
    const bearer = req.headers["authorization"]
      ? bearerHeader.split(" ")
      : bearerHeader.split("=");

    const bearerToken = bearer[1];
    try {
      const payload = verifyJWT(bearerToken);

      if (payload.type === UserType.Admin) {
        req[req.method === "GET" ? "query" : "body"] = {
          ...req[req.method === "GET" ? "query" : "body"],
          ...(payload as JwtAuthPayload),
          token: bearerToken,
        };
        next();
      } else {
        res.status(401).send({ success: false, message: "Unauthorized" });
      }
    } catch (err) {
      res.status(403).send({ success: false, message: "Forbidden" });
      return;
    }
  } else {
    res.status(403).send({ success: false, message: "Forbidden" });
    return;
  }
};

export {
  AuthenticateSession,
  UserAuthenticateSession,
  AdminAuthenticateSession,
};
