import { Observable } from 'rxjs/Observable';
import { HttpRequest } from './HttpRequest';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from './models/HttpResponse';
import { AuthenticationService } from '../../services/authentication.service';

export class HttpPostRequest extends HttpRequest {
  public constructor(private http: HttpClient,
    private actionUrl: string,
    private data: any,
    authService?: AuthenticationService) {
    super(authService);
  }

  public getResult(): Observable<any> {
    return this.http
      .post(this.actionUrl, this.data, this.basicAuthorizationHeader());
  }
}
