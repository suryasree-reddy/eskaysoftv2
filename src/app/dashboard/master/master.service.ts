
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

    return this.httpClient.get(this.END_POINt+tragetServiceName).subscribe(res => {
        console.log("this.END_POINt+tragetServiceName---", this.END_POINt+tragetServiceName)
      this.resposeArray = res;
      this.dataObject.next(this.resposeArray);
    })

  }

}
