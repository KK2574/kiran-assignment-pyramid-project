import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      const res = context.switchToHttp().getResponse<Response>();
      const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
      this.safeRedirect(res, `${frontendUrl}/login?error=google_auth_failed`);
      return { __authFailed: true };
    }
    return user;
  }

  private safeRedirect(res: Response, url: string) {
    if (res.headersSent) {
      this.logger.warn("skipped redirect — response already sent (likely a duplicate request)");
      return;
    }
    try {
      res.redirect(url);
    } catch (e) {
      this.logger.warn(`redirect failed harmlessly: ${(e as Error).message}`);
    }
  }
}