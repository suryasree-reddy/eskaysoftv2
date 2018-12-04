import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthenticationService {

  public badCredentials: Subject<boolean> = new Subject<boolean>();
  private jwtHelper: JwtHelper = new JwtHelper();
  
  constructor(private http: HttpClient,
    private router: Router) {
  }

  authenticateUser(user) {
    this.http.post(environment.api.url + 'auth/signin', user).subscribe(res => {
      if( res ){
        localStorage.setItem('id_token', JSON.stringify(res));
        if(this.isNewUser()){
          this.router.navigate(['admin/changePassword']);
        }else{
          this.router.navigate(['dashboard']);
        }
        
      }
      this.badCredentials.next(false);

    }, (error) => {
      this.badCredentials.next(true);
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
  getCurrentUserName(){
    let token = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));    
    return token.userName;
  }

  getCurrentUserRoles(){
    let token = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));
    console.log(token);    
    return token.roles;
  }
  isNewUser(){
    let token = this.jwtHelper.decodeToken(localStorage.getItem('id_token'));    
    return token.isNew;
  }
  roleMatch(allowedRoles){
    var ismatch = false;
    var userRoles:string[] = this.getCurrentUserRoles();
    console.log(userRoles);
    allowedRoles.forEach(element => {
      if(userRoles.indexOf(element) > -1){
        ismatch = true;
        return false;
      }
    });
    return ismatch;
  }

}
