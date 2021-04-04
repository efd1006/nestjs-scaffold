import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import 'dotenv/config';
import { UserEntity } from '../../user/entity/user.entity';
import { IAuthPayload } from '../interfaces';
import { UserAuthSessionEntity } from '../entity/user_auth_session.entity';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthSessionEntity) private userAuthSessionsRepository: Repository<UserAuthSessionEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IAuthPayload) {
    const { id } = payload;
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const session = await this.userAuthSessionsRepository.findOne({where: { user_id: user.id }})
    if(!session) {
      throw new UnauthorizedException()
    }

    return await user.toJSON();
  }
}
