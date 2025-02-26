import {Injectable} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';


//Implementation with passport-jwt, more abstract
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
