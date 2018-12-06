import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import * as _ from 'lodash';
import { subscribeTo } from 'rxjs/internal-compatibility';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {

  public companyForm: FormGroup;
  public companyGroupForm: FormGroup;
  private endPoint: string = "company/";
  private cgEndPoint: string = "companygroup/";
  @Input() gridDataList: any = [];
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public selectedTypeahead: any;
  public nameFlag;
  public deleteFlag: boolean = true;
  public companyCode;
  public companyTypeList: any = [];
  public companyStatusList: any = [];
  public invGenList: any = [];
  private duplicateCompanyCode: boolean = false;
  private duplicateCompanyName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public typeaheadDataList: any = [];
  modalRef: BsModalRef;
  message: string;
  @ViewChild('focus') focusField: ElementRef;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-5";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.companyForm = this.fb.group({
      id: [],
      companyGroupId: [],
      companyGroupName: ['', Validators.required],
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      companyStatus: ['', Validators.required],
      invGenType: ['', Validators.required],
      invPrefix: ['', Validators.required]
    });

    this.companyTypeList = this.sharedDataService.getSharedCommonJsonData().CompanyType;
    this.companyStatusList = this.sharedDataService.getSharedCommonJsonData().CompanyStatus;
    this.invGenList = this.sharedDataService.getSharedCommonJsonData().InvGenType;
    this.loadTypeaheadData();
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  openModal(template: TemplateRef<any>) {
      this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  loadTypeaheadData() {
    this.masterService.getParentData(this.cgEndPoint).subscribe(list => {
      this.typeaheadDataList = list;
    })
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateCompanyName || !this.duplicateCompanyCode) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }
    if (this.duplicateCompanyName && this.duplicateCompanyCode) {
      this.duplicateMessage = "companies.duplicateErrorMessage";
    }
    else if (this.duplicateCompanyCode) {
      this.duplicateMessage = "companies.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.companyForm.value.companyCode;
    }
    else if (this.duplicateCompanyName) {
      this.duplicateMessage = "companies.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.companyForm.value.companyName;
    }
  }

  checkForDuplicateCompanyCode() {
    this.duplicateCompanyCode = this.masterService.hasDataExist(this.gridDataList, 'companyCode', this.companyForm.value.companyCode);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateCompanyName() {
    if (!this.nameFlag) {
      this.duplicateCompanyName = this.masterService.hasDataExist(this.gridDataList, 'companyName', this.companyForm.value.companyName);
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
      if (this.modalRef !== undefined && this.modalRef !== null) {
      this.modalRef.hide();
      this.modalService.hide(1);
        this.modalRef = null;
      this.loadTypeaheadData();
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

  loadSelectedTypeahead(event) {
    this.selectedTypeahead = event.item;
    this.companyForm.patchValue({ companyGroupId: this.selectedTypeahead.id })
  }

  resetForm() {
    this.companyForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.formRequiredError = this.formSuccess = false;
    this.duplicateCompanyName = false;
    this.duplicateCompanyCode = false;
    if(!this.isModelWindowView){
        this.loadGridData();
    }
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.companyForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }


}
