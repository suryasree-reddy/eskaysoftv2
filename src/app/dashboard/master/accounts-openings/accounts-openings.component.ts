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
  selector: 'app-accounts-openings',
  templateUrl: './accounts-openings.component.html'
})
export class AccountsOpeningsComponent implements OnInit {

  public accOpeningForm: FormGroup;
  private endPoint: string = "accountopenings/";
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public gridDataList: any = [];
  public accType: any[];
  public accOpeningColumns;
  public editAccount;
  public deleteFlag: boolean = true;
  public nameFlag;
  private prevAccCode: string = null;
  private duplicateAccountName: boolean = false;
  private duplicateAccountCode: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;

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
    this.gridDataList = dataList;
  }

  ngOnInit() {
    this.accOpeningForm = this.fb.group({
      id: [],
      code: ['', Validators.required],
      accountName: ['', Validators.required],
      town: ['', Validators.required],
      opening: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.loadGridData();
  //  this.focusField.nativeElement.focus();
    this.getAccOpenings();
    this.getAccType();
  }

  getAccType() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accType = data["AccountType"];
      // this.accOpeningColumns = data["AccountsOpeningsColumns"]
    });
  }

  getAccOpenings() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accOpeningColumns = data["AccountsOpeningsColumns"]
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  getDuplicateErrorMessages(): void {
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    if (this.duplicateAccountName) {
      this.duplicateMessage = "accountopenings.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.accOpeningForm.value.accountName;
    } else if (this.duplicateAccountCode) {
      this.duplicateMessage = "accountopenings.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.accOpeningForm.value.code;
    }
  }

  checkForDuplicateAccountName() {
    if (!this.nameFlag) {
      this.duplicateAccountName = this.masterService.hasDataExist(this.gridDataList, 'accountName', this.accOpeningForm.value.accountName);
      if (this.duplicateAccountName) {
        const temp = this.accOpeningForm.value.accountName;
        const accObj = _.filter(this.gridDataList, function(o) { return o.accountName.toLowerCase() == temp.toLowerCase() });
        this.accOpeningForm.patchValue({ code: accObj[0].code })
        // this.accOpeningForm.patchValue({ type: accObj[0].type })
      }
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateAccountCode() {
    this.duplicateAccountCode = false;
    if (this.prevAccCode != this.accOpeningForm.value.code) {
      this.duplicateAccountCode = this.masterService.hasDataExist(this.gridDataList, 'code', this.accOpeningForm.value.code);
    }
    this.getDuplicateErrorMessages();
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
    this.accOpeningForm.reset();
    this.duplicateAccountName = false;
    this.duplicateAccountCode = false;
    this.editAccount = null;
    this.prevAccCode = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editAccount = s;
    this.prevAccCode = s.code
    this.accOpeningForm.reset(s);
    this.deleteFlag = !this.editAccount.deleteFlag;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
  }



}
