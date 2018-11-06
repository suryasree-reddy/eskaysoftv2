import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    constructor(private sharedDataService:SharedDataService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.sharedDataService.setErrorCode(null);
      this.sharedDataService.setErrorMesage(null);
       if(localStorage.getItem('id_token')){
            const token = JSON.parse(localStorage.getItem('id_token'));
            if(token && token.tokenType){
                const headers = req.headers.set('Authorization', token.tokenType + ' ' + token.accessToken );
                const authReq = req.clone({ headers });
                return next.handle(authReq);
            }
        }
        return next.handle(req);
    }
}
