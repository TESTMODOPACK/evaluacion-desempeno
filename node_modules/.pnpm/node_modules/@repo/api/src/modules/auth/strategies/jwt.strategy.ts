import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET || 'secretKey',
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
