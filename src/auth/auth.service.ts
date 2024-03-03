import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      ...newUser,
      token: this.getJwtToken({ id: newUser.id })
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.usersRepository.findOne({ where: { email }, select: { email: true, password: true, status: true } });

    if(!user) throw new UnauthorizedException('No existe un usuario con ese email');
    if(!user.status) throw new UnauthorizedException('No puede iniciar sesion con ese usuario. Hable con un administrador');
    
    const compare = await bcrypt.compare(password, user.password);
    if(!compare) throw new UnauthorizedException('Credenciales invalidas');

    const token = this.getJwtToken({ id: user.id });
    
    return {
      ...user,
      token
    };
  }

  async logout(response: Response) {
    
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
