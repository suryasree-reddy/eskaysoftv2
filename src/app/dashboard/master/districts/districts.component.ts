import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
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
  public formSuccess: boolean = false;
  private duplicateStateName: boolean = false;
  private duplicateStateCode: boolean = false;
  public formRequiredError: boolean = false;
  public districtsList: any = [];
  public statesList: any = [];
  public nameFlag;
  public deleteFlag: boolean = true;
  public selectedState: any;
  public distName;
  public stateZone: any[];
  private duplicateDistName: boolean = false;
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
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  ngOnInit() {
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

    if (this.duplicateDistName) {
      this.duplicateMessage = "districts.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.districtsForm.value.districtName;
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

  verifyDistDuplicates() {
    let distNameList = this.districtsList.map((item) => { return item.districtName });
    return this.masterService.verifyDuplicates(distNameList, this.districtsForm.value.districtName, true);
  }

  save() {
    this.buttonsComponent.save();
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
      if(this.isModelWindowView){
        this.callbackOnModelWindowClose.emit();
      }else{
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
    if(!this.isModelWindowView){
        this.loadGridData();
    }
    this.loadStatesData();
    this.formRequiredError = this.formSuccess = false;
    this.districtsForm.reset();
    this.nameFlag = false;
    this.deleteFlag = false;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.duplicateDistName = false;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.districtsForm.reset(s);
    this.nameFlag = true;
    this.selectedState = {};
    this.selectedState.id = s.stateId;
    this.deleteFlag = !s.deleteFlag;
    this.districtsForm.reset(s);
  }

}
