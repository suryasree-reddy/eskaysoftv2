import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  errorCode: number = null;
  errorMesage: string = null;

  sharedCommonJsonData: any = [];

  constructor() { }

  setSharedCommonJsonData(val: any[]) {
    this.sharedCommonJsonData = val;
  }

  getSharedCommonJsonData() {
    return this.sharedCommonJsonData;
  }

  setErrorCode(val: number) {
    this.errorCode = val;
  }

  getErrorCode() {
    return this.errorCode;
  }

  setErrorMesage(val: string) {
    this.errorMesage = val;
  }

  getErrorMesage() {
    return this.errorMesage;
  }

}
