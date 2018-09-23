import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subschedule',
  templateUrl: './subschedule.component.html',
  styleUrls: ['./subschedule.component.scss']
})
export class SubscheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  public subScheduleForm: FormGroup;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  subScheduleList: any = [];
  scheduleList: any = [];
  editSubSchedule: any;
  public selectedSchedule: any;
  scheduleTypes: any;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  public subScheduleListColumns = [
    { headerName: 'Sub-Schedule Name', field: 'subScheduleName' },
    { headerName: 'Schedule Id', field: 'scheduleId', filter: "agNumberColumnFilter", width: 80 },
    { headerName: 'Sub-Schedule Index', field: 'subScheduleIndex', filter: "agNumberColumnFilter", width: 100 }
  ];

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

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

    this.subScheduleForm = this.fb.group({
      subScheduleId: [],
      subScheduleName: ['', Validators.required],
      subScheduleIndex: ['', Validators.required],
      scheduleId: [],
      scheduleName: []
    });
    this.loadGriddata();
    this.loadScheduleData();
    this.focusField.nativeElement.focus();
    this.getScheduleTypes();
    this.rowSelection = "single";
  }

  loadScheduleData() {
    this.masterService.getParentData("schedules/").subscribe(list => {
      this.scheduleList = list;
    })
  }

  loadGriddata() {
    this.masterService.getData("subschedules/");
    this.masterService.dataObject.subscribe(list => {
      this.subScheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    })
  }

  onSelectSchedule(event) {
    this.selectedSchedule = event.item;
  }

  openModal(template: TemplateRef<any>) {
    this.resetScheduleForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
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

  saveSchedule() {
    if (confirm('Are you sure!!')) {

      if (this.scheduleForm.valid) {
        this.masterService.createRecord(this.scheduleForm.value).subscribe(res => {
          this.scheduleForm.reset();
          this.modalRef.hide();

        }, (error) => {
          this.scServerErrMsg();
        });

      } else {
        this.scRequiredErrMsg();
      }
    }
  }

  resetScheduleForm() {
    this.scheduleForm.reset();
  }

  save() {
    this.formRequiredError = false;
    if (this.subScheduleForm.valid && this.selectedSchedule && this.selectedSchedule.id) {
      if (confirm('Are you sure!!')) {
        this.subScheduleForm.value.scheduleId = this.selectedSchedule.id;
        if (this.subScheduleForm.value.subScheduleId) {
          this.masterService.updateRecord("subschedules/", this.subScheduleForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord("subschedules/", this.subScheduleForm.value).subscribe(res => {

            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        }
        this.resetForm();
      }
    } else {
      this.requiredErrMsg();
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord("subschedules/", this.editSubSchedule.subScheduleId).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
      this.resetForm();
      localStorage.removeItem('ag-activeRow');
    }
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  scRequiredErrMsg() {
    this.scFormRequiredError = true;
    this.scFormSuccess = this.scFormServerError = false;
  }

  scServerErrMsg() {
    this.scFormServerError = true;
    this.scFormRequiredError = this.scFormSuccess = false;
  }

  resetForm() {
    this.loadGriddata();
    this.loadScheduleData();
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.subScheduleForm.reset();
    this.editSubSchedule = null;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editSubSchedule = s;
    this.selectedSchedule = {};
    this.selectedSchedule.id = s.scheduleId;
    this.subScheduleForm.reset(s);
  }

}
