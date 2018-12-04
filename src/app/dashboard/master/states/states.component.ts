import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import * as _ from 'lodash';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

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

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-5";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
      private sharedDataService:SharedDataService,
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
    if(this.isModelWindowView){
      this.loadGridData();
    }
    this.focusField.nativeElement.focus();
  this.stateZone =  this.sharedDataService.getSharedCommonJsonData().StateZone;
  }

  getDuplicateErrorMessages(): void {
    if(!this.duplicateStateName || !this.duplicateStateCode){
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateStateName && this.duplicateStateCode) {
      this.duplicateMessage = "states.duplicateErrorMessage";
    }
    else if (this.duplicateStateName) {
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
    this.statesForm.reset();
    this.duplicateStateName = false;
    this.duplicateStateCode = false;
    this.editStates = null;
    this.prevStateCode = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.duplicateStateName = false;
    this.duplicateStateCode = false;
    this.formRequiredError = this.formSuccess = false;
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
