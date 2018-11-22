import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html'
})

export class ScheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  private endPoint: string = "schedules/";
  public scheduleTypes: any = [];
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public scheduleList: any = [];
  public editSchedule;
  public deleteFlag: boolean = true;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public nameFlag;
  public gridDataList: Observable<any[]>;
  public lastSchIndex;
  public cap;
  //modalRef: BsModalRef;
  private duplicateSchName: boolean = false;
  private duplicateSchIndex: boolean = false;

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.scheduleList = dataList;
  }

  ngOnInit() {
    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });
    this.focusField.nativeElement.focus();
    this.scheduleTypes = this.sharedDataService.getSharedCommonJsonData().ScheduleTypes;
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    this.duplicateSchIndex = false;
    if (this.lastSchIndex != this.scheduleForm.value.scheduleIndex) {
      this.duplicateSchIndex = this.masterService.hasDataExist(this.scheduleList, 'scheduleIndex', parseInt(this.scheduleForm.value.scheduleIndex));
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateSchName || !this.duplicateSchIndex) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }

    if (this.duplicateSchName && this.duplicateSchIndex) {
      this.duplicateMessage = "schedule.duplicateErrorMessage";
    }
    else if (this.duplicateSchIndex) {
      this.duplicateMessage = "schedule.duplicateIndexErrorMessage";
      this.duplicateMessageParam = this.scheduleForm.value.scheduleIndex;

    }
    else if (this.duplicateSchName) {
      this.duplicateMessage = "schedule.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.scheduleForm.value.scheduleName;
    }
  }

  checkForDuplicateScheduleName() {
    if (!this.nameFlag) {
      this.duplicateSchName = this.masterService.hasDataExist(this.scheduleList, 'scheduleName', this.scheduleForm.value.scheduleName);
      this.getDuplicateErrorMessages();
    }
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.scheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    });
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.scheduleForm.reset();
    this.editSchedule = null;
    this.deleteFlag = true;
    this.duplicateSchIndex = false;
    this.duplicateSchName = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.duplicateSchName = false;
    this.duplicateSchIndex = false;
    this.nameFlag = false;
    this.lastSchIndex;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.formRequiredError = false;
    this.editSchedule = s;
    this.scheduleForm.reset(s);
    this.lastSchIndex = this.editSchedule.scheduleIndex;
    this.deleteFlag = !this.editSchedule.deleteFlag;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    this.nameFlag = true;
  }

}
