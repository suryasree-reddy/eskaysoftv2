import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html',
  styleUrls: ['./purchase-returns.component.scss']
})
export class PurchaseReturnsComponent implements OnInit {

  private purchaseReturnsForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "purchaseReturns/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicatePurRetnNo: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private PurRetnList: any = [];
  private suppliersList: any = [];

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  ngOnInit() {
    this.purchaseReturnsForm = this.fb.group({
      id: [],
      purReturnNumber: ['', Validators.required],
      supplier: ['', Validators.required],
      remarks: ['', Validators.required],
      date: ['', Validators.required]
    });

    //  this.rolesList = this.sharedDataService.getSharedCommonJsonData().UserRoles;
  }

  checkForDuplicatePurRetnNo() {
    if (!this.nameFlag) {
      this.duplicatePurRetnNo = this.masterService.hasDataExist(this.PurRetnList, 'purReturnNumber', this.purchaseReturnsForm.value.purReturnNumber);
      this.getDuplicateErrorMessages();
    }

  }

  loadSupplierData() {
    this.masterService.getParentData("accountinformation/").subscribe(list => {
      this.suppliersList = list;
    });
  }
  checkForDuplicateUserName() {

  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicatePurRetnNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicatePurRetnNo) {
      this.duplicateMessage = "purchaseReturn.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.purchaseReturnsForm.value.purReturnNumber;
    }
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
    this.purchaseReturnsForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicatePurRetnNo = false;
    this.duplicateUserName = false;
    this.formRequiredError = this.formSuccess = false;
  }

}
