import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthenticationService {

  
  constructor(private http: HttpClient,
    private router: Router) {
  }

  authenticateUser(user) {

  //   return this.http.post(environment.api.url + 'auth/signin', user).map(user => {
  //     // login successful if there's a jwt token in the response
  //     if (user && user.token) {
  //         // store user details and jwt token in local storage to keep user logged in between page refreshes
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //     }

  //     return user;
  // })


    return this.http.post(environment.api.url + 'auth/signin', user).subscribe(res => {
      console.log(res);
      if( res ){
        localStorage.setItem('id_token', JSON.stringify(res));
        this.router.navigate(['dashboard']);
      }
    });
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    localStorage.clear();
  }

}
