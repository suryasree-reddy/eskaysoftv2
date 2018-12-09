import {Injectable} from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    if (this.authService.getToken() && this.authService.loggedIn()) {
      let expectedRoles = route.data["roles"];
      if(expectedRoles){
        var match = this.authService.roleMatch(expectedRoles);
        if(match){
          return true;
        }else {
          this.router.navigate(['/dashboard/forbidden']);
          return false;
        }
      }else
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}
