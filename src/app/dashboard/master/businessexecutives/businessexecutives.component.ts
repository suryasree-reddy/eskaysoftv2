import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-businessexecutives',
  templateUrl: './businessexecutives.component.html'
})

export class BusinessexecutivesComponent implements OnInit {

  public businessExecutiveForm: FormGroup;
  private endPoint: string = "businessexecutive/";
  @Input() gridDataList: any = [];
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public busiExecNum;
  private duplicateBusExecName: boolean = false;
  private duplicateBusExecNum: boolean = false;
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

  ngOnInit() {
    this.businessExecutiveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      mobile: ['', Validators.required]
    });
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    if (this.busiExecNum != this.businessExecutiveForm.value.mobile) {
      this.duplicateBusExecNum = this.masterService.hasDataExist(this.gridDataList, 'mobile', parseInt(this.businessExecutiveForm.value.mobile));
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if(!this.duplicateBusExecName || !this.duplicateBusExecNum){
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
      this.formRequiredError = false;
    }

    if (this.duplicateBusExecName && this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateErrorMessage";

    } else if (this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateIndexErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.mobile;

    } else if (this.duplicateBusExecName) {
      this.duplicateMessage = "businessexecutive.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.name;
    }
  }

  checkForDuplicateBusiExecName() {
    if (!this.nameFlag) {
      this.duplicateBusExecName = this.masterService.hasDataExist(this.gridDataList, 'name', this.businessExecutiveForm.value.name);
      this.getDuplicateErrorMessages();
    }
  }

  loadGridData() {
    this.masterService.getData("businessexecutive/");
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
    this.businessExecutiveForm.reset();
    this.gridSelectedRow = null;
    this.duplicateMessage = null
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateBusExecName = false;
    this.duplicateBusExecNum = false;
    this.formRequiredError = this.formSuccess = false;
    if(!this.isModelWindowView){
        this.loadGridData();
    }
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.businessExecutiveForm.reset(s);
    this.deleteFlag = !this.gridSelectedRow.deleteFlag;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
  }

}
