import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  sharedCommonJsonData: any = [];

  constructor() {}

  setSharedCommonJsonData(val: any[]){
      this.sharedCommonJsonData= val;
    }

  getSharedCommonJsonData(){
      return this.sharedCommonJsonData;
    }
}
