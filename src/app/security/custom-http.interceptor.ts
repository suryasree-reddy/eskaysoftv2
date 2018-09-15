import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers, Request } from '@angular/http';
import { Observable } from 'rxjs/Observable';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';

@Injectable()
export class CustomHttpInterceptor extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    options = new RequestOptions();
    options.headers = new Headers();

    const token = localStorage.getItem('id_token');

    if (typeof url === 'string') {
      if (!options) {
        options = { headers: new Headers() };
      }
      if (token) {
        options.headers.set('Authorization', token);
      }
      // options.headers.set('Content-type', 'application/json');
    } else {
      if (token) {
        url.headers.set('Authorization', token);
      }
      // options.headers.set('Content-type', 'application/json');
    }
    // return super.request(url, options);
    return super.request(url, options).catch((error: Response) => {
      if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
        console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
        window.location.href = window.location.origin;
      }
      return Observable.throw(error);
    });
  }
}
