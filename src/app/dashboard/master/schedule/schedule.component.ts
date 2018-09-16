import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from './schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  public scheduleTypes: any = [];
  public formError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) { }


  ngOnInit() {
    this.scheduleForm = this.fb.group({
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });

    this.getScheduleTypes();


  }

  getScheduleTypes() {
    this.scheduleTypes = [{
      "code": "ASS",
      "description": "Assets"
    }, {
      "code": "LIA",
      "description": "Liabilities"
    }, {
      "code": "TRADE",
      "description": "Trading"
    }, {
      "code": "PNL",
      "description": "Profit & Loss"
    }]
  }


  addSchedule() {
    if( this.scheduleForm.valid ){
      this.scheduleService.createSchedule(this.scheduleForm.value);
    }else{
      this.formError = true;
    }
    
  }

}
