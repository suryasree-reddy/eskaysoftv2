import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubscheduleService {

  public subSchedules: Subject<any> = new Subject<any>();
  public subScheduleArr: any = [];

  constructor(private httpClient: HttpClient) { }



  getAllSchedules() {
    return this.httpClient.get('https://eskaysoft.synectiks.com/api/v1/schedules/');
  }

  getAll() {
    return this.httpClient.get('https://eskaysoft.synectiks.com/api/v1/subschedules/').subscribe(res => {
      this.subScheduleArr = res;
      this.subSchedules.next(this.subScheduleArr);
    })

  }


  create(subSchedule) {
    return this.httpClient.post('https://eskaysoft.synectiks.com/api/v1/subschedules/', subSchedule).subscribe(res => {
      // this.subScheduleArr.unshift(res);
      // this.subSchedules.next(this.subScheduleArr);
      this.getAll();
    })
  }

  update(subSchedule) {
    
    return this.httpClient.put('https://eskaysoft.synectiks.com/api/v1/subschedules/', subSchedule).subscribe(res => {
      this.getAll();
    })
  }

  delete(ssId) {
    return this.httpClient.delete('https://eskaysoft.synectiks.com/api/v1/subschedules/' + ssId).subscribe(res => {
      this.getAll();
    })
  }
}
