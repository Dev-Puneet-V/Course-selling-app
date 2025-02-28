import { Request } from "express";
import { Iuser } from "./user";

interface AuthenticatedRequest extends Request {
  user?: Iuser;
}

type IAuthRequest = AuthenticatedRequest & {
  headers: { authorization: string };
};

interface IJwtDecoded {
  userId: string;
}

export type { AuthenticatedRequest, IAuthRequest, IJwtDecoded };
