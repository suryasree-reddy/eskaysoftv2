import { Schedule } from './../../../shared/model/schedule';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  public schedules: Subject<any> = new Subject<any>();
  public scheduleArr: any = [];

  constructor(private httpClient: HttpClient) { }



  getAllSchedules() {
    return this.httpClient.get('https://eskaysoft.synectiks.com/api/v1/schedules/').subscribe(res => {
      this.scheduleArr = res;
      this.schedules.next(this.scheduleArr);
    })

  }

  createSchedule(schedule) {
    console.log(schedule);
    return this.httpClient.post('https://eskaysoft.synectiks.com/api/v1/schedules/', schedule).subscribe(res => {
      this.scheduleArr.unshift(res);
      this.schedules.next(this.scheduleArr);
    })
  }

  updateSchedule(schedule) {

    return this.httpClient.put('https://eskaysoft.synectiks.com/api/v1/schedules/', schedule).subscribe(res => {
      this.getAllSchedules();
    })
  }

  deleteSchedule(scheduleId) {
    return this.httpClient.delete('https://eskaysoft.synectiks.com/api/v1/schedules/'+ scheduleId).subscribe(res => {
      this.getAllSchedules();
    })
  }
}
