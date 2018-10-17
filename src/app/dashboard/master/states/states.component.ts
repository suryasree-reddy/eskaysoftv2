import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html'
})
export class StatesComponent implements OnInit {

  public statesForm: FormGroup;
  private endPoint: string = "states/";
  private prevStateCode: string = null;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public statesList: any = [];
  public stateZone: any[];
  public statesListColumns;
  public editStates;
  public deleteFlag: boolean = true;
  public nameFlag;
  public stateName;
  private duplicateStateName: boolean = false;
  private duplicateStateCode: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "State";
  private deleteConfirmMsg: string = "states.deleteConfirmationMessage";
  private saveConfirmMsg: string = "states.saveConfirmationMessage";
  private saveInfoMsg: string = "states.saveInformationMessage";
  private deleteInfoMsg: string = "states.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.statesList = dataList;
  }

  ngOnInit() {
    this.statesForm = this.fb.group({
      id: [],
      stateName: ['', Validators.required],
      stateCode: ['', Validators.required],
      zone: ['', Validators.required],
    });
    //this.loadGridData();
    this.focusField.nativeElement.focus();
    this.getStatesTypes();
    this.getZone();
  }


  getZone() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.stateZone = data["StateZone"];
      this.statesListColumns = data["StateListColumns"]
    });
  }
  
  getDuplicateErrorMessages(): void {
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    if (this.duplicateStateName) {
      this.duplicateMessage = "states.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.statesForm.value.stateName;
    } else if (this.duplicateStateCode) {
      this.duplicateMessage = "states.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.statesForm.value.stateCode;
    }
  }

  checkForDuplicateStateName() {
    if (!this.nameFlag) {
      this.duplicateStateName = this.masterService.hasDataExist(this.statesList, 'stateName', this.statesForm.value.stateName);
      if (this.duplicateStateName) {
        const temp = this.statesForm.value.stateName;
        const stateObj = _.filter(this.statesList, function(o) { return o.stateName.toLowerCase() == temp.toLowerCase() });
        this.statesForm.patchValue({ stateCode: stateObj[0].stateCode })
        this.statesForm.patchValue({ zone: stateObj[0].zone })
      }
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateStateCode() {
    this.duplicateStateCode = false;
    if (this.prevStateCode != this.statesForm.value.stateCode) {
      this.duplicateStateCode = this.masterService.hasDataExist(this.statesList, 'stateCode', parseInt(this.statesForm.value.stateCode));
    }
    this.getDuplicateErrorMessages();
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.statesList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.statesList.length));
    });
  }

  getStatesTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.statesListColumns = data["StateListColumns"]
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
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = this.formServerError = false;
    }
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.statesForm.reset();
    this.duplicateStateName = false;
    this.duplicateStateCode = false;
    this.editStates = null;
    this.prevStateCode = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editStates = s;
    this.prevStateCode = s.stateCode
    this.statesForm.reset(s);
    this.deleteFlag = !this.editStates.deleteFlag;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
  }

}
