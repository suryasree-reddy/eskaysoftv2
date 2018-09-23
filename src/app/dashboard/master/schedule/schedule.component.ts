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

  @ViewChild('focus') focusField: ElementRef;

  public scheduleListColumns = [
    { headerName: 'Schedule Name', field: 'scheduleName' },
    { headerName: 'Schedule Index', field: 'scheduleIndex', filter: 'agNumberColumnFilter', width: 100 },
    { headerName: 'Schedule Type', field: 'scheduleType', width: 100 },
    { headerName: 'Status', field: 'deleteFlag', cellRenderer: 'deltaIndicator', suppressFilter: true, width: 50 }
  ];

  constructor(private fb: FormBuilder, private translate: TranslateService, private masterService: MasterService ) {
    translate.setDefaultLang('messages.en');
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
    this.focusField.nativeElement.focus();
    this.getScheduleTypes();
    //  this.masterService.getLocalJsonData();
    //  this.masterService.dataObject.subscribe(list => {
    //    this.scheduleTypes = list;
    //    console.log("this.scheduleTypes--", list.ScheduleTypes)
    //  })
  }

  loadGridData() {
    this.masterService.getData("schedules/");
    this.masterService.dataObject.subscribe(list => {
      this.scheduleList = list;
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    });
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
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editSchedule = s;
    this.scheduleForm.reset(s);
    this.deleteFlag = !this.editSchedule.deleteFlag;
    this.nameFlag = true;
  }

}
