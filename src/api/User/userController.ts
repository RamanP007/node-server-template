/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { JwtAuthPayload } from "../../types";
import getIP from "../../utils/getIP";
import {
  AuthUserPayload,
  SecureAccountPayload,
  ChangePasswordPayload,
  ActivityLogsPayload,
} from "./payloads";

/**
 * UserController have all required callbacks
 * to handle user '/user' endpoints
 */
export class UserController {
  sendHttpResponse(
    res: Response,
    serverResponse: { data?: unknown; error?: string; code?: number } | Error
  ): void {
    if (serverResponse instanceof Error) {
      res.status(500).send(serverResponse.message);
    } else if (serverResponse.error) {
      res.status(serverResponse.code || 422).send(serverResponse.error);
    } else {
      res.status(200).send(serverResponse.data);
    }
  }

  authUser = async (req: Request, res: Response): Promise<void> => {
    const args: AuthUserPayload = { ...req.body, ip: getIP(req) };
    // const response = await userModel.authUser(
    //   args.username || "",
    //   args.password || "",
    //   args.ip
    // );
    // this.sendHttpResponse(res, response);
  };

  getUserDetails = async (req: Request, res: Response): Promise<void> => {
    const query: unknown = req.query;

    if (query && typeof query === "object") {
      const args = { ...query } as JwtAuthPayload;
      //   const response = await userModel.getUserDetails(args._uid);
      //   this.sendHttpResponse(res, response);
    } else {
      res.status(400).end();
    }
  };

  secureAccount = async (req: Request, res: Response): Promise<void> => {
    const args: SecureAccountPayload = { ...req.body };

    if (!args.transactionCode || !args.newPassword) {
      res.status(400).end();
    } else {
      //   const response = await userModel.secureAccount(
      //     args._uid,
      //     args.transactionCode,
      //     args.newPassword
      //   );
      //   this.sendHttpResponse(res, response);
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const args: ChangePasswordPayload = { ...req.body, ip: getIP(req) };

    if (!args.oldPassword || !args.newPassword) {
      res.status(400).end();
    } else {
      //   const response = await userModel.changePassword(
      //     args._uid,
      //     args.oldPassword,
      //     args.newPassword,
      //     args.ip
      //   );
      //   this.sendHttpResponse(res, response);
    }
  };

  activityLogs = async (req: Request, res: Response): Promise<void> => {
    const query: unknown = req.query;

    if (query && typeof query === "object") {
      const args = { ...query } as ActivityLogsPayload;
      //   const response = await userModel.activityLogs(
      //     args._uid,
      //     args.fromDate,
      //     args.toDate,
      //     args.offset,
      //     args.limit
      //   );
      //   this.sendHttpResponse(res, response);
    } else {
      res.status(400).end();
    }
  };
}
