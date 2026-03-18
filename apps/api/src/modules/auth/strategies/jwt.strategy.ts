import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'super_secret_default_key_needs_to_be_long'),
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT token
    return { 
      id: payload.sub, 
      email: payload.email, 
      role: payload.role,
      organizationId: payload.organizationId,
      employeeId: payload.employeeId 
    };
  }
}
