import {Request} from 'express';
import * as jwt from 'jsonwebtoken';

export class JSONWebToken {
  public decodedToken: any;

  public constructor(request: Request) {
    this.decodedToken = jwt.decode(JSONWebToken.GET_TOKEN_FROM_REQUEST(request));
  }

  public static GET_TOKEN_FROM_REQUEST(request: Request): string {
    let token = request.headers['x-access-token'] as string;
    if (!token) {
      token = request.body ? request.body.token : null;
    }
    if (!token) {
      token = request.query ? request.query.token : null;
    }

    return token;
  }
}
