import { UserType } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface JwtAuthPayload extends JwtPayload {
  id: string;
  type: UserType;
  token: string;
}
