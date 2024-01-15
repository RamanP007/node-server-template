import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { JwtAuthPayload } from "../../common/dto";
import client from "../../redis.config";
import dayjs from "dayjs";
import _ from "lodash";

type BlacklistTokenPayload = {
  token: string;
  setTime: number;
};

export default class UserController {
  blacklistToken = async (userId: string, token: string) => {
    const alreadyBlackListedToken = await client.get(`blacklist_${userId}`);
    const currentUnix = dayjs().unix();

    const blacklistTokenData = { token, setTime: currentUnix };

    if (alreadyBlackListedToken) {
      const _alreadyBlackListedToken: BlacklistTokenPayload[] = JSON.parse(
        alreadyBlackListedToken
      );

      if (_alreadyBlackListedToken.length) {
        const index = _.findIndex(_alreadyBlackListedToken, { token });

        if (index !== -1) {
          throw new Error("Forbidden");
        }

        const lastBlacklistTokenData =
          _alreadyBlackListedToken[_alreadyBlackListedToken.length - 1];

        if (dayjs().unix() - lastBlacklistTokenData.setTime > 24 * 60 * 60) {
          return await client.set(
            `blacklist_${userId}`,
            JSON.stringify([blacklistTokenData])
          );
        } else {
          const newBlacklistTokenData = [
            ..._alreadyBlackListedToken,
            blacklistTokenData,
          ];
          return await client.set(
            `blacklist_${userId}`,
            JSON.stringify(newBlacklistTokenData)
          );
        }
      }
    } else {
      return await client.set(
        `blacklist_${userId}`,
        JSON.stringify([blacklistTokenData])
      );
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const args = plainToClass(JwtAuthPayload, { ...req.body });
      await this.blacklistToken(args.id, args.token);
      res.clearCookie(`__${args.type.toLowerCase()}AccessToken`);
      res.send({ success: true });
    } catch (error) {
      next(error);
    }
  };
}
