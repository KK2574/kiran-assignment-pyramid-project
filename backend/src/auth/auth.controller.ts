import { Body, Controller, Post } from "@nestjs/common";
import { randomUUID } from "crypto";

@Controller("auth")
export class AuthController {
  @Post("guest")
  guestLogin() {
    return {
      user: {
        id: randomUUID(),
        name: "Guest",
        email: "guest@pyramid.app",
        isGuest: true,
      },
      token: `guest-${randomUUID()}`,
    };
  }

  // Placeholder for real Google OAuth (Passport strategy) — wire up
  // GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET and a proper callback here.
  @Post("google")
  googleLogin(@Body() body: { name: string; email: string }) {
    return {
      user: { id: randomUUID(), name: body.name, email: body.email, isGuest: false },
      token: `google-${randomUUID()}`,
    };
  }
}
