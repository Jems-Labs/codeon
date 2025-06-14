import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      auth: () => { userId: string };
    }
  }
}

export {};