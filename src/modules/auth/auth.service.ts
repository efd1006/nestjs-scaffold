import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { comparePassword, hashPassword } from '../../shared/utils';
import { UserEntity } from '../user/entity/user.entity';
import { LoginDTO, RegisterDTO } from './dto';
import { IAuthPayload } from './interfaces';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config'
import { UserAuthSessionEntity } from './entity/user_auth_session.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    @InjectRepository(UserAuthSessionEntity) private userAuthSessionsRepository: Repository<UserAuthSessionEntity>,
    private jwtService: JwtService
  ) {

  }

  async login(dto: LoginDTO) {

    // find the user
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      relations: ['role']
    })

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST)
    }

    // check if password is valid
    const isValid = await comparePassword(dto.password, user.password)
    if (!isValid) {
      throw new HttpException('Invalid credentials.', HttpStatus.BAD_REQUEST)
    }

    // create authpayload
    const authpayload: IAuthPayload = {
      id: user.id
    }
    const token = await this.getTokens(authpayload)

    return {
      user: user.toJSON(),
      access_token: token.access_token,
      refresh_token: token.refresh_token
    }
  }

  async register(dto: RegisterDTO) {
    let user = await this.usersRepository.findOne({
      where: { email: dto.email }
    })
    if (user) {
      throw new HttpException("Email already used.", HttpStatus.BAD_REQUEST)
    }

    // hash password 
    let hashedPassword = await hashPassword(dto.password)
    dto = {
      ...dto,
      password: hashedPassword
    }

    user = await this.usersRepository.create(dto)
    await this.usersRepository.save(user)

    return {
      user: user,
      message: 'Registration successful.'
    }

  }

  async refresh(refresh_token: string) {
    try {
      jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET);
      const data = jwt.decode(refresh_token);

      const session = await this.userAuthSessionsRepository.findOne({
        where: { user_id: data['id'] }
      })

      if (session && session.refresh_token === refresh_token) {
        const payload: IAuthPayload = {
          id: data['id'],
        };
        const token = await this.getTokens(payload);
        return {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        };
      } else {
        throw 'Invalid refresh token.';
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(currentUser: UserEntity) {
    const session = await this.userAuthSessionsRepository.delete({ user_id: currentUser.id })
    return {
      message: 'Logged out successfully.'
    }
  }

  private async getTokens(payload: IAuthPayload) {
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN },
    );

    // create a session (could be improved)
    const session = await this.userAuthSessionsRepository.findOne({
      where: { user_id: payload.id }
    })

    if (session) {
      await this.userAuthSessionsRepository.update({ id: session.id }, {
        access_token: accessToken,
        refresh_token: refreshToken
      })
    } else {
      await this.userAuthSessionsRepository.save({
        user_id: payload.id,
        access_token: accessToken,
        refresh_token: refreshToken
      })
    }

    return {
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
}
