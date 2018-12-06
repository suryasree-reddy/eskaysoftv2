import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-subschedule',
  templateUrl: './subschedule.component.html'
})

export class SubscheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  private endPoint = 'subschedules/';
  public subScheduleForm: FormGroup;
  public formRequiredError = false;
  public formSuccess = false;
  public nameFlag;
  subScheduleList: any = [];
  scheduleList: any = [];
  editSubSchedule: any;
  public selectedSchedule: any;
  scheduleTypes: any;
  modalRef: BsModalRef;
  message: string;
  private deleteFlag = true;
  private duplicateSchName = false;
  private duplicateSubSchName = false;
  private duplicateSchIndex = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  @ViewChild('focus') focusField: ElementRef;
  @Input() isModelWindowView = false;
  @Input() bodyStyle = 'col-xs-5';
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private modalService: BsModalService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.subScheduleList = dataList;
  }

  ngOnInit() {
    this.subScheduleForm = this.fb.group({
      id: [],
      subScheduleName: ['', Validators.required],
      subScheduleIndex: ['', Validators.required],
      scheduleId: [],
      scheduleName: []
    });
    this.loadScheduleData();
    this.focusField.nativeElement.focus();
    this.scheduleTypes = this.sharedDataService.getSharedCommonJsonData().ScheduleTypes;
  }

  loadScheduleData() {
    this.masterService.getParentData('schedules/').subscribe(list => {
      this.scheduleList = list;
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.subScheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.subScheduleList.length));
    });
  }

  onSelectSchedule(event) {
    this.selectedSchedule = event.item;
    const temp = this.selectedSchedule.id;
    const tempName = this.selectedSchedule.name;
    const selectedScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.scheduleId === temp ; });
    if (this.nameFlag && this.editSubSchedule.scheduleId !== event.item.id) {
      this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 });
    }
    if (!this.nameFlag) {
      this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 });
    }
  }

  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  checkForDuplicateSubScheduleName() {
    if (!this.nameFlag) {
      this.duplicateSubSchName = this.masterService.hasDataExist(this.subScheduleList,
        'subScheduleName', this.subScheduleForm.value.subScheduleName);
      this.getDuplicateErrorMessages();
    }
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    this.duplicateSchIndex = this.masterService.hasDataExist(this.scheduleList,
      'scheduleIndex', parseInt(this.scheduleForm.value.scheduleIndex, 0));
    this.getDuplicateErrorMessages();
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateSubSchName) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }

    if (this.duplicateSubSchName) {
      this.duplicateMessage = 'subschedule.duplicateNameErrorMessage';
      this.duplicateMessageParam = this.subScheduleForm.value.subScheduleName;
    }
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    if (this.modalRef !== undefined && this.modalRef !== null) {
      this.modalRef.hide();
      this.modalService.hide(1);
      this.modalRef = null;
      this.loadScheduleData();
    } else {
      if (this.isModelWindowView) {
        this.callbackOnModelWindowClose.emit();
      } else {
        this.formSuccess = true;
        this.formRequiredError = false;
        this.resetForm();
      }
    }
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    if (!this.isModelWindowView) {
        this.loadGridData();
    }
    this.loadScheduleData();
    this.formRequiredError = this.formSuccess = false;
    this.subScheduleForm.reset();
    this.editSubSchedule = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.duplicateSubSchName = false;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.nameFlag = true;
    this.editSubSchedule = s;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.selectedSchedule = {};
    this.selectedSchedule.id = s.scheduleId;
    this.deleteFlag = !this.editSubSchedule.deleteFlag;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.subScheduleForm.reset(s);
  }


}
