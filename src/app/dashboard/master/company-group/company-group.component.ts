import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-company-group',
  templateUrl: './company-group.component.html'
})
export class CompanyGroupComponent implements OnInit {

  public companyGroupForm: FormGroup;
  private endPoint: string = "companygroup/";
  public gridDataList: any = [];
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public companyGrp;
  private duplicateCompanyGrp: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Company Group";
  private deleteConfirmMsg: string = "companygroup.deleteConfirmationMessage";
  private saveConfirmMsg: string = "companygroup.saveConfirmationMessage";
  private saveInfoMsg: string = "companygroup.saveInformationMessage";
  private deleteInfoMsg: string = "companygroup.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.companyGroupForm = this.fb.group({
      id: [],
      companyGroupName: ['', Validators.required]
    });
    //this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }
  getDuplicateErrorMessages(): void {
    if (!this.duplicateCompanyGrp) {
      this.duplicateMessage = null;
      this.formRequiredError = false;
      this.duplicateMessageParam = null;
    }

    if (this.duplicateCompanyGrp) {
      this.duplicateMessage = "companygroup.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.companyGroupForm.value.companyGroupName;
    }
  }

  checkForDuplicateCompanyGrp() {
    if (!this.nameFlag) {
      this.duplicateCompanyGrp = this.masterService.hasDataExist(this.gridDataList, 'companyGroupName', this.companyGroupForm.value.companyGroupName);
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
    this.companyGroupForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateCompanyGrp = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.companyGroupForm.reset(s);
    this.nameFlag = true;
    this.deleteFlag = false;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }


}
