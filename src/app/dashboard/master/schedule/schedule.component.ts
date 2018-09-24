import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
//import { SynectiksCommonGridComponent } from '../../../commonComponents/synectiks-common-grid/synectiks-common-grid.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  public scheduleTypes: any = [];
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public scheduleList: any = [];
  public scheduleListColumns;
  public editSchedule;
  public deleteFlag;
  public nameFlag;



 //public jsonData;
  //@ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, private translate: TranslateService, private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
    //  jsonData : object [];
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  ngOnInit() {
    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });

    this.loadGridData();
  //  this.focusField.nativeElement.focus();
    this.getScheduleTypes();
  }

  loadGridData() {
    this.masterService.getData("schedules/");
    this.masterService.dataObject.subscribe(list => {
      this.scheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    });
  }

  getScheduleTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
       data as object [];
        this.scheduleTypes =data["ScheduleTypes"];
        this.scheduleListColumns = data["ScheduleListColumns"]
    });
  }

  save() {
    if (this.scheduleForm.valid) {
      if (confirm('Are you sure!!')) {
        if (this.scheduleForm.value.id) {
          this.masterService.updateRecord('schedules/', this.scheduleForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord('schedules/', this.scheduleForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        }
      }
    } else {
      this.requiredErrMsg()
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord('schedules/', this.editSchedule.id).subscribe(res => {
        localStorage.removeItem('ag-activeRow');
        this.successMsg()
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.scheduleForm.reset();
    this.editSchedule = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
  //  this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editSchedule = s;
    this.scheduleForm.reset(s);
    this.deleteFlag = !this.editSchedule.deleteFlag;
    this.nameFlag = true;
  }

}
