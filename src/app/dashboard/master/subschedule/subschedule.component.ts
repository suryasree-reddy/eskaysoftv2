import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import * as _ from 'lodash';

@Component({
  selector: 'app-subschedule',
  templateUrl: './subschedule.component.html'
})
export class SubscheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  private endPoint: string = "subschedules/";
  public subScheduleForm: FormGroup;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public nameFlag;
  subScheduleList: any = [];
  scheduleList: any = [];
  editSubSchedule: any;
  public selectedSchedule: any;
  scheduleTypes: any;
  modalRef: BsModalRef;
  message: string;
  public deleteFlag: boolean =true;
  public subScheduleListColumns;
  @ViewChild('focus') focusField: ElementRef;

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
  }

  loadScheduleData() {
    this.masterService.getParentData("schedules/").subscribe(list => {
      this.scheduleList = list;
    })
  }

  loadGriddata() {
    this.masterService.getData(this.endPoint);
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
    this.masterService.getLocalJsonData().subscribe(data => {
    data as object [];
      this.scheduleTypes = data["ScheduleTypes"];
      this.subScheduleListColumns = data["SubScheduleListColumns"];
    });
  }

  saveSchedule() {
    if (confirm('Are you sure!!')) {

      if (this.scheduleForm.valid) {
        this.masterService.createRecord("schedules/", this.scheduleForm.value).subscribe(res => {
            this.modalRef.hide();
          this.scheduleForm.reset();

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
          this.masterService.updateRecord(this.endPoint, this.subScheduleForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord(this.endPoint, this.subScheduleForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        }
      }
    } else {
      this.requiredErrMsg();
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord(this.endPoint, this.editSubSchedule.subScheduleId).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
      localStorage.removeItem('ag-activeRow');
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
    this.nameFlag = false;
    this.deleteFlag = true;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.nameFlag = true;
    this.editSubSchedule = s;
    this.selectedSchedule = {};
    this.selectedSchedule.id = s.scheduleId;
    this.deleteFlag = false;
    this.subScheduleForm.reset(s);
  }

}
