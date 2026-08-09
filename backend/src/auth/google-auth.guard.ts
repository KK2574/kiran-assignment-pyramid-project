import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.warn(
      `handleRequest called — err=${JSON.stringify(err)} user=${JSON.stringify(user)} info=${JSON.stringify(info)}`,
    );

    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      if (res.headersSent) {
        this.logger.error("headers already sent before guard could redirect — skipping");
        return { __authFailed: true };
      }
      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
      this.logger.warn(`redirecting to ${frontendUrl}/login?error=google_auth_failed`);
      res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
      return { __authFailed: true };
    }
    this.logger.warn("auth succeeded, passing user through");
    return user;
  }
}