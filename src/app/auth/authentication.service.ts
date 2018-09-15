import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  authToken: any;

  constructor(private http: Http) {
  }


  authenticateUser(user) {
    return this.http.post(environment.api.url + 'users/login', user);
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  loggedIn() {
    // console.log("logged in : "+tokenNotExpired());
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    localStorage.clear();
  }

}
