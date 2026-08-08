import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      return undefined;
    }
    return user;
  }
}