import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { EAuthProvider } from '../../common/types/auth.types';
import { jwtDecode } from 'jwt-decode';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async verifyAndAuthenticateUser(idToken: string) {
    let payload: TokenPayload;
    let provider: EAuthProvider;
    const decoded = jwtDecode(idToken);

    switch (decoded.iss) {
      case 'https://accounts.google.com': {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload()!;
        provider = EAuthProvider.GOOGLE;
        break;
      }
      default:
        throw new UnauthorizedException('Invalid provider');
    }

    return this.userService.findOrCreateUser({
      provider,
      providerId: payload.sub,
      name: payload.name,
      email: payload.email,
    });
  }
}
