import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import type { Response, Request } from "express";
import { getCachedAuth, setCachedAuth } from "./auth-code-cache";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  private readonly logger = new Logger(GoogleAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext): TUser {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const code = req.query.code as string | undefined;

    if (user) {
      if (code) setCachedAuth(code, user);
      this.completeLogin(res, frontendUrl, user);
      return { __handled: true } as TUser;
    }

    // This attempt failed — but if a racing duplicate request already
    // succeeded with this exact authorization code, reuse that success
    // instead of showing the user a false "denied" error.
    if (code) {
      const cached = getCachedAuth(code);
      if (cached) {
        this.logger.warn("duplicate request reusing cached successful auth for this code");
        this.completeLogin(res, frontendUrl, cached.user);
        return { __handled: true } as TUser;
      }
    }

    this.safeRedirect(res, `${frontendUrl}/login?error=google_auth_failed`);
    return { __handled: true } as TUser;
  }

  private completeLogin(res: Response, frontendUrl: string, googleUser: any) {
    const user = { id: randomUUID(), ...googleUser };
    const token = this.jwtService.sign(user);
    const params = new URLSearchParams({
      token,
      name: user.name,
      email: user.email,
      ...(user.picture ? { picture: user.picture } : {}),
    });
    this.safeRedirect(res, `${frontendUrl}/auth/callback?${params.toString()}`);
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
