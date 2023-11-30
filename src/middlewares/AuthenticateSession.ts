import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { JwtAuthPayload } from "../types";

const AuthenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];

    try {
      const payload = jwt.verify(
        bearerToken,
        process.env.JWT_TOKEN_SECRET as Secret
      ) as JwtPayload;
      req[req.method === "GET" ? "query" : "body"] = {
        ...req[req.method === "GET" ? "query" : "body"],
        ...(payload as JwtAuthPayload),
      };
      next();
    } catch (err) {
      res.sendStatus(403);
      return;
    }
  } else {
    res.sendStatus(403);
    return;
  }
};

export default AuthenticateSession;
