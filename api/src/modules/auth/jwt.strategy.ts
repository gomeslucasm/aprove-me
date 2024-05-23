import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ENVIRONMENT } from '../../common/constants';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: ENVIRONMENT.SECRET_KEY,
    });
  }

  async validate(req: Request, payload: any) {
    req.user = {
      userId: payload.sub,
      username: payload.username,
      assignorId: payload.assignorId,
    };
    return {
      userId: payload.sub,
      username: payload.username,
      assignorId: payload.assignorId,
    };
  }
}
