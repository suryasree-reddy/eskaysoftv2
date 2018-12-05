import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
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
  @Input() gridDataList: any = [];
  public editSchedule;
  public deleteFlag: boolean = true;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public nameFlag;
  public lastSchIndex;
  public cap;
  private duplicateSchName: boolean = false;
  private duplicateSchIndex: boolean = false;

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-5";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

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
    this.gridDataList = dataList;
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
      this.duplicateSchIndex = this.masterService.hasDataExist(this.gridDataList, 'scheduleIndex', parseInt(this.scheduleForm.value.scheduleIndex));
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
      this.duplicateSchName = this.masterService.hasDataExist(this.gridDataList, 'scheduleName', this.scheduleForm.value.scheduleName);
      this.getDuplicateErrorMessages();
    }
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    if(this.isModelWindowView){
      this.callbackOnModelWindowClose.emit();
    }else{
      this.formSuccess = true;
      this.formRequiredError = false;
      this.resetForm();
    }
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
    if(!this.isModelWindowView){
        this.loadGridData();
    }
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
