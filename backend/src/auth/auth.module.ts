import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "google" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "dev-only-secret-change-in-production",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}