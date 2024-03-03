import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UnauthorizedException } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ){
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  
  //Custom jwt response and validate if the user exists to provide the user in the app.
  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;
    const user = await this.usersRepository.findOneBy({ id });
    
    if(!user) throw new UnauthorizedException('Token invalido');
    if(!user.status) throw new UnauthorizedException('Token invalido porque el usuario fue inhabilitado');

    return user;
  }
}