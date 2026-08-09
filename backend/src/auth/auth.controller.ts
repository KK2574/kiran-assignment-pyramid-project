import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Request, Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { GoogleAuthGuard } from "./google-auth.guard";

@Controller("auth")
export class AuthController {
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

  // Kicks off the real Google OAuth redirect. The guard itself redirects
  // the browser to Google's consent screen — this handler body never runs.
  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  // Google redirects back here whether the user approved or denied access.
  // On denial, GoogleAuthGuard.handleRequest already redirected to /login
  // and left req.user unset — so we just no-op in that case rather than
  // trying to redirect a second time (which would crash with
  // ERR_HTTP_HEADERS_SENT since the response was already sent).
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  googleCallback(@Req() req: Request, @Res() res: Response) {
    const googleUser = (req as any).user;
    if (!googleUser || googleUser.__authFailed) return;

    const user = { id: randomUUID(), ...googleUser };
    const token = this.jwtService.sign(user);

    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";
    const params = new URLSearchParams({
      token,
      name: user.name,
      email: user.email,
    });
    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }
}
