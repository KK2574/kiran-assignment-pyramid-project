import { Controller, Get, Post, UseGuards } from "@nestjs/common";
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

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  // All redirect logic (success, failure, and deduplication of racing
  // duplicate callback requests) lives in GoogleAuthGuard.handleRequest —
  // this handler body intentionally does nothing.
  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  googleCallback() {}
}
