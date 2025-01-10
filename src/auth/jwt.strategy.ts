import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DUMMY_BEARER_TOKEN } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly dummyUser = { sub: '-1', username: 'dummy_user' };
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: (req: any) => {
        const data = req.headers['authorization'];

        if (data) {
          const [type, token] = data.split(' ');
          if (type === 'Bearer') {
            if (
              process.env.MODE === 'development' &&
              token === DUMMY_BEARER_TOKEN
            ) {
              this.logger.warn('Dummy token issued');

              return this.jwtService.sign(this.dummyUser);
            }

            return token;
          }
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET,
    });
  }

  // TODO: Imrove typing and don't use the UserEntity
  async validate(
    payload: any,
  ): Promise<Omit<UserEntity, 'password' | 'recipes'>> {
    return { id: payload.sub, username: payload.username };
  }
}
