import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html'
})
export class DistrictsComponent implements OnInit {
  private endPoint: string = "districts/";
  private stateEndPoint: string = "states/";
  public districtsForm: FormGroup;
  public statesForm: FormGroup;
  public formSuccess: boolean = false;
  private duplicateStateName: boolean = false;
  private duplicateStateCode: boolean = false;
  public formRequiredError: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public districtsList: any = [];
  public statesList: any = [];
  public editDistricts;
  public nameFlag;
  public deleteFlag: boolean = true;
  public selectedState: any;
  public distName;
  public stateZone: any[];
  private duplicateDistName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public childDuplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  public childDuplicateMessage: string = null;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.districtsList = dataList;
  }

  openModal(template: TemplateRef<any>) {
    this.resetStatesForm();
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  ngOnInit() {
    this.statesForm = this.fb.group({
      id: [],
      stateName: ['', Validators.required],
      stateCode: ['', Validators.required],
      zone: ['', Validators.required],
    });

    this.districtsForm = this.fb.group({
      id: [],
      districtName: ['', Validators.required],
      stateId: ['', Validators.required],
      stateName: ['', Validators.required]
    });

    this.loadStatesData();
    this.focusField.nativeElement.focus();
    this.stateZone = this.sharedDataService.getSharedCommonJsonData().StateZone;
  }

  getDuplicateErrorMessages(): void {

    if (!this.duplicateDistName) {
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
      this.formRequiredError = false;
    }

    if (!this.duplicateStateName || !this.duplicateStateCode) {
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.scFormRequiredError = false;
    }

    if (this.duplicateDistName) {
      this.duplicateMessage = "districts.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.districtsForm.value.districtName;
    }
    if (this.duplicateStateName && this.duplicateStateCode) {
      this.childDuplicateMessage = "states.duplicateErrorMessage";

    }
    else if (this.duplicateStateName) {
      this.childDuplicateMessage = "states.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.statesForm.value.stateName;

    } else if (this.duplicateStateCode) {
      this.childDuplicateMessage = "states.duplicateCodeErrorMessage";
      this.childDuplicateMessageParam = this.statesForm.value.stateCode;
    }

  }

  checkForDuplicateDistName() {
    if (!this.nameFlag) {
      this.duplicateDistName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
      this.getDuplicateErrorMessages();
    }
  }

  loadStatesData() {
    this.masterService.getParentData("states/").subscribe(list => {
      this.statesList = list;
    })
  }

  onSelectState(event) {
    this.selectedState = event.item;
    this.districtsForm.patchValue({ stateId: this.selectedState.id });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.districtsList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.districtsList.length));
    });
  }

  checkForDuplicateStateCode() {
    this.duplicateStateCode = this.masterService.hasDataExist(this.statesList, 'stateCode', parseInt(this.statesForm.value.stateCode));
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateStateName() {
    this.duplicateStateName = this.masterService.hasDataExist(this.statesList, 'stateName', this.statesForm.value.stateName);
    this.getDuplicateErrorMessages();
  }

  verifyDistDuplicates() {
    let distNameList = this.districtsList.map((item) => { return item.districtName });
    return this.masterService.verifyDuplicates(distNameList, this.districtsForm.value.districtName, true);
  }

  save() {
    this.buttonsComponent.save();
  }

  saveState() {
    if (this.statesForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal();
    } else {
      this.scRequiredErrMsg();
    }
  }

  save_State() {
    this.masterService.createRecord("states/", this.statesForm.value).subscribe(res => {
      this.showInformationModal();
      this.loadStatesData();
      this.modalRef.hide();
      this.statesForm.reset();

    }, (error) => {
      throw error;
    });
  }

  delete() {
    this.districtsForm.value.stateId = this.selectedState.id;
    this.buttonsComponent.delete();
  }

  successMsg() {
    if (this.modalRef != undefined) {
      this.modalRef.hide();
      this.loadStatesData();
      //  this.focusField.nativeElement.focus();
    } else {
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

  scRequiredErrMsg() {
    if (this.childDuplicateMessage == null) {
      this.scFormRequiredError = true;
      this.scFormSuccess = false;
    }

  }

  resetForm() {
    this.loadGridData();
    this.loadStatesData();
    this.formRequiredError = this.formSuccess = false;
    this.districtsForm.reset();
    this.childDuplicateMessage = null;
    this.editDistricts = null;
    this.nameFlag = false;
    this.deleteFlag = false;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.childDuplicateMessageParam = null;
    this.duplicateDistName = false;
    this.focusField.nativeElement.focus();
  }

  resetStatesForm() {
    this.childDuplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.scFormRequiredError = this.scFormSuccess = false;
    this.duplicateStateName = false;
    this.duplicateStateCode = false;
    this.statesForm.reset();
  }

  editable(s) {
    this.editDistricts = s;
    this.districtsForm.reset(s);
    this.nameFlag = true;
    this.selectedState = {};
    this.childDuplicateMessage = null;
    this.selectedState.id = s.stateId;
    this.deleteFlag = !this.editDistricts.deleteFlag;
    this.districtsForm.reset(s);
  }

  showInformationModal() {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      "State", "states.saveInformationMessage", '');
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe();
  }

  showConfirmationModal(): void {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      "State", "states.saveConfirmationMessage", 'green', '');
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.save_State();
      }
    });
  }

}
