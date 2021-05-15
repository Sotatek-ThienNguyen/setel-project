import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginStatus } from './interfaces/login-status.interface';
import { LoginUserDto } from '../users/dto/user-login.dto';
import { JwtPayload } from './interfaces/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    if (loginUserDto.username !== 'admin') {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    };
    const user = { username: loginUserDto.username };
    // generate and sign token
    const token = this._createToken(user);

    return {
      username: user.username,
      ...token,
    };
  }

  async validateUser(payload: JwtPayload): Promise<Object> {
    const user = { username: payload.username };
    if (user.username !== 'admin') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ username }): any {
    const expiresIn = process.env.EXPIRESIN;
    const user: JwtPayload = { username };
    const accessToken = this.jwtService.sign(user);
    return {
      expiresIn,
      accessToken,
    };
  }
}
