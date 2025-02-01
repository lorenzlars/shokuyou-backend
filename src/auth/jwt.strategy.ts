import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from 'src/users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: any) => {
        const data = req.headers['authorization'];

        if (data) {
          const [type, token] = data.split(' ');

          if (type === 'Bearer') {
            return token;
          }
        }

        return null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // TODO: Imrove typing and don't use the UserEntity
  async validate(
    payload: any,
  ): Promise<Omit<UserEntity, 'password' | 'recipes' | 'plans'>> {
    const user = await this.usersService.getById(payload.sub);

    if (!user) {
      this.logger.error(
        `Deleted user with token payload ${JSON.stringify(payload)} tried to login`,
      );

      throw new UnauthorizedException();
    }

    return { id: user.id, username: user.username };
  }
}
