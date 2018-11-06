import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedDataService } from './shared-data.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
     private sharedDataService:SharedDataService) {


        }

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      //Backend returns unsuccessful response codes such as 404, 500 etc.

      console.error('Backend returned status code: ', error.status);
      console.error('Response body:', error.error.message);
      this.sharedDataService.setErrorCode(error.status);
      this.sharedDataService.setErrorMesage(error.error.message.substring(error.error.message.lastIndexOf( ":" )));
    } else {
      //A client-side or network error occurred.
      this.sharedDataService.setErrorCode(error.status);
    }
  }


}
