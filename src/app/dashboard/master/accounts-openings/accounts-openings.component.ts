import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-accounts-openings',
  templateUrl: './accounts-openings.component.html'
})

export class AccountsOpeningsComponent implements OnInit {

  public accOpeningForm: FormGroup;
  private endPoint: string = "accountinformation/";
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public gridDataList: any = [];
  public openingType: any[];
  public editAccount;
  public deleteFlag: boolean = true;
  public nameFlag;
  modalRef: BsModalRef;
  message: string;
  private errorMessage: string = null;
  private errorStatusCode: string = null;
  private errorStatusMsg: string = null;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

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
    this.accOpeningForm = this.fb.group({
      id: [],
      shortName: ['', Validators.required],
      accountName: ['', Validators.required],
      town: ['', Validators.required],
      openingBalance: ['', Validators.required],
      openingType: ['', Validators.required]
    });
    this.openingType = this.sharedDataService.getSharedCommonJsonData().AccountType;
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
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
  }

  serverErrMsg(error) {
    let temp = this.buttonsComponent.errorValue.error.message;
    this.errorStatusMsg = temp.substring(temp.lastIndexOf( ":" ));
    this.errorStatusCode = this.buttonsComponent.errorValue.status;
    this.errorMessage = "serverError.errorMessage";
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.accOpeningForm.reset();
    this.editAccount = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editAccount = s;
    this.accOpeningForm.reset(s);
    this.deleteFlag = !this.editAccount.deleteFlag;
    this.formRequiredError = false;
    this.nameFlag = true;
  }

}
