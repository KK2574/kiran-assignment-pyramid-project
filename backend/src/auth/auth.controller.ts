import { Controller, Get, Post, Req, Res, UseGuards, Logger } from "@nestjs/common";
import type { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { GoogleAuthGuard } from "./google-auth.guard";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly jwtService: JwtService) {}

  @Post("guest")
  guestLogin() {
    const user = {
      id: randomUUID(),
      name: "Guest",
      email: "guest@pyramid.app",
      isGuest: true,
    };
    const token = this.jwtService.sign(user);
    return { user, token };
  }

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = (req as any).user;

    if (!googleUser || googleUser.__authFailed) return;

    if (res.headersSent) {
      this.logger.warn("controller skipped — response already sent (likely a duplicate request)");
      return;
    }

    const user = { id: randomUUID(), ...googleUser };
    const token = this.jwtService.sign(user);

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const params = new URLSearchParams({
      token,
      name: user.name,
      email: user.email,
    });

    try {
      res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
    } catch (e) {
      this.logger.warn(`redirect failed harmlessly: ${(e as Error).message}`);
    }
  }
}