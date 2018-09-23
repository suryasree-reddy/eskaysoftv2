
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  public dataObject: Subject<any> = new Subject<any>();
  public resposeArray: any = [];

  constructor(private httpClient: HttpClient) { }

  END_POINt = 'https://eskaysoft.synectiks.com/api/v1/';

  getData(tragetServiceName) {
    return this.httpClient.get(this.END_POINt + tragetServiceName).subscribe(res => {
      this.resposeArray = res;
      this.dataObject.next(this.resposeArray);
    })
  }

  getLocalJsonData() {
    return this.httpClient.get("assets/jsonData/commonData.json").subscribe(data => {
      console.log("res--", res.ScheduleTypes);
      this.resposeArray = res.ScheduleTypes;
      this.dataObject.next(this.resposeArray);
    })
  }

  createRecord(tragetServiceName, requestObj) {
    return this.httpClient.post(this.END_POINt + tragetServiceName, requestObj);
  }

  updateRecord(tragetServiceName, requestObj) {
    return this.httpClient.put(this.END_POINt + tragetServiceName, requestObj);
  }

  deleteRecord(tragetServiceName, requestObj) {
    return this.httpClient.delete(this.END_POINt + tragetServiceName+ requestObj);
  }

}
