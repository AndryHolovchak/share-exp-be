import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { EAuthProvider } from '../../common/types/auth.types';
import { jwtDecode } from 'jwt-decode';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from '../../common/database/schemas/auth.schema';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private authModel: Model<Auth>,
    private userService: UsersService,
  ) {}

  async verifyAndAuthenticateUser(idToken: string) {
    let payload: TokenPayload;
    let provider: EAuthProvider;
    const decoded = jwtDecode(idToken);

    switch (decoded.iss) {
      case 'https://accounts.google.com': {
        const ticket = await googleClient.verifyIdToken({
          idToken,
        });
        payload = ticket.getPayload()!;
        provider = EAuthProvider.GOOGLE;
        break;
      }
      default:
        throw new UnauthorizedException('Invalid provider');
    }

    const userAuth = await this.authModel
      .findOne({
        provider,
        providerId: payload.sub,
      })
      .exec();

    console.log({ userAuth });

    if (userAuth) {
      return this.userService.findById(userAuth.user);
    } else {
      const user = await this.userService.createUser({
        name: payload.name || '',
        email: payload.email,
        picture: payload.picture,
      });

      await this.authModel.create({
        provider,
        providerId: payload.sub,
        user: user._id,
      });

      return user;
    }
  }
}
