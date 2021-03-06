import { Container } from 'typedi';
import { JsonController, Post, Body, Res } from 'routing-controllers';
import { LoggerInstance } from 'winston';
import { ClientAuthenticator, AuthenticationResponse } from '../../utils/authentication/ClientAuthenticator';
import { LoggerFactory } from '../../utils/logger';

class LoginParams {
  public username: string;
  public password: string;
}

@JsonController('/login')
export class AuthController {
  private logger: LoggerInstance = Container.get(LoggerFactory).getInstance('AuthController');

  @Post('/')
  public async login(@Body() loginParams: LoginParams, @Res() response: any): Promise<void> {
    const clientAuthenticator = new ClientAuthenticator(
      this.logger,
      loginParams.username,
      loginParams.password
    );

    try {
      const authenticationResponse = await clientAuthenticator.authenticate();
      if (authenticationResponse.success) {
        response.status(200).json(authenticationResponse);
      } else if (authenticationResponse.errcode === 'ENOTFOUND') {
        response.status(404).json(authenticationResponse);
      } else {
        response.status(400).json(authenticationResponse);
      }
    } catch (error) {
      response.status(500).json(<AuthenticationResponse>{
        success: false,
        status: 'FAILED',
        message: 'Server error occurred.'
      });
    }
  }
}
