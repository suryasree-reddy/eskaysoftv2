
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  public dataObject: Subject<any> = new Subject<any>();
  public resposeArray: any = [];
  gridDataList: Observable<any[]> = this.dataObject.asObservable().distinctUntilChanged();
  private _localUrl: string = "./assets/jsonData/commonData.json"

  constructor(private httpClient: HttpClient) { }

  END_POINt = 'http://183.82.119.84:8000/api/v1/';

  getData(tragetServiceName) {
    return this.httpClient.get(this.END_POINt + tragetServiceName).subscribe(res => {
      this.resposeArray = res;
      this.dataObject.next(this.resposeArray);
    })
  }

  getDataNew(tragetServiceName): Observable<any> { // for future reference
    return this.httpClient.get(this.END_POINt + tragetServiceName).map(res => {
      this.dataObject.next(res);
    });
  }

  getParentData(tragetServiceName) {
    return this.httpClient.get(this.END_POINt + tragetServiceName);
  }

  getLocalJsonData() {
    return this.httpClient.get(this._localUrl);
  }


  createRecord(tragetServiceName, requestObj) {
    return this.httpClient.post(this.END_POINt + tragetServiceName, requestObj);
  }

  updateRecord(tragetServiceName, requestObj) {
    return this.httpClient.put(this.END_POINt + tragetServiceName, requestObj);
  }

  deleteRecord(tragetServiceName, requestObj) {
    return this.httpClient.delete(this.END_POINt + tragetServiceName + requestObj);
  }

  hasDataExist(listObj, key, value): boolean {
    return _.find(listObj, function(o) { return _.get(o, key) == value }) != undefined;
  }

  mergeObjects(arr1, arr2, key1, key2): any[]{
    return  _.map(arr1, function(item) {
      return _.merge(item, _.find(arr2, function(o) { return _.get(item, key1) == _.get(o, key2) }));
    });

  }
}
