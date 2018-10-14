import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {

  public companyForm: FormGroup;
  public companyGroupForm: FormGroup;
  private endPoint: string = "company/";
  private cgEndPoint: string = "companygroup/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public selectedTypeahead: any;
  public nameFlag;
  public deleteFlag: boolean = true;
  public companyCode;
  private duplicateCompanyCode: boolean = false;
  private duplicateCompanyName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public typeaheadDataList: any = [];
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  private duplicateCompanyGrp: boolean = false;
  modalRef: BsModalRef;
  message: string;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) {
      translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.companyForm = this.fb.group({
      companyId: [],
      companyGroupId: [],
      companyGroupName: [],
      companyGroup:['', Validators.required],
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      companyStatus: ['', Validators.required],
      invGenType: ['', Validators.required],
      invPrefix: ['', Validators.required]
    });

    this.companyGroupForm = this.fb.group({
      id: [],
      companyGroup: ['', Validators.required]
    });

    //this.loadGridData();
    this.getGridCloumsList();
    this.loadTypeaheadData();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }
  onInitialDataLoad(dataList:any[]){
    this.gridDataList = dataList;
  }
  checkForDuplicateCompanyGrp() {
    this.duplicateCompanyGrp = this.masterService.hasDataExist(this.typeaheadDataList, 'companyGroup', this.companyGroupForm.value.companyGroup);
    this.getDuplicateErrorMessages();
  }

  openModal(template: TemplateRef<any>) {
    this.resetChildForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  loadTypeaheadData() {
    this.masterService.getParentData(this.cgEndPoint).subscribe(list => {
      this.typeaheadDataList = list;
    })
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.scFormRequiredError = false;

    if(this.duplicateCompanyName && this.duplicateCompanyCode){
      this.duplicateMessage = "companies.duplicateErrorMessage";
    } else if (this.duplicateCompanyCode) {
      this.duplicateMessage = "companies.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.companyForm.value.companyCode;
    }else if(this.duplicateCompanyName){
      this.duplicateMessage = "companies.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.companyForm.value.companyName;
    }

    if (this.duplicateCompanyGrp) {
      this.childDuplicateMessage = "companygroup.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.companyGroupForm.value.companyGroup;
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


  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["CompanyColumns"];
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  save() {

      if (this.companyForm.value.id && this.selectedTypeahead && this.selectedTypeahead.id) {
        this.companyForm.value.companyGroupId = this.selectedTypeahead.id;
        this.masterService.updateRecord(this.endPoint, this.companyForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          this.serverErrMsg();
        });
      } else {
        this.companyForm.value.companyGroupId = this.selectedTypeahead.id;
        this.masterService.createRecord(this.endPoint, this.companyForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          this.serverErrMsg();
        });
      }


  }

  saveChildForm() {
    this.scFormRequiredError = false;
    if (this.companyGroupForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveChildForm");
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChildData() {
    this.masterService.createRecord(this.cgEndPoint, this.companyGroupForm.value).subscribe(res => {
      this.showInformationModal("SaveChildForm");

    }, (error) => {
      this.serverErrMsg();
    });

  }
  saveForm() {
    this.formRequiredError = false;
    if (this.companyForm.valid) {
      this.showConfirmationModal("Save");
    } else {
      this.requiredErrMsg()
    }
  }

  delete() {
    this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
      localStorage.removeItem('ag-activeRow');
      this.showInformationModal("Delete");
    }, (error) => {
      this.serverErrMsg();
    });

  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
    this.resetChildForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = this.formServerError = false;
    }
  }
  loadSelectedTypeahead(event) {
    this.selectedTypeahead = event.item;
  }
  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.companyForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.companyForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = false;
  }

  resetChildForm() {
    this.scFormRequiredError = false;
    this.scFormServerError = false;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.companyGroupForm.reset();
  }
  scRequiredErrMsg() {
    this.scFormRequiredError = true;
    this.scFormSuccess = this.scFormServerError = false;
  }

  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'companies.deleteInformationMessage';
      title = 'Company';
    } else if (eventType === "Save") {
      title = 'Company';
      msg = 'companies.saveInformationMessage';
    } else if (eventType === "SaveChildForm") {
      title = 'Company Group';
      msg = 'companygroup.saveInformationMessage';

    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      title,
      msg,
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => { this.successMsg(); });
  }

  showConfirmationModal(eventType): void {
    var msg;
    var title;
    if (eventType === "Delete") {
      title = 'Company';
      msg = 'companies.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Company';
      msg = 'companies.saveConfirmationMessage';
    } else if (eventType === "SaveChildForm") {
      title = 'Company Group';
      msg = 'companygroup.saveConfirmationMessage';

    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      title,
      msg,
      'green',
      ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        if (eventType === "Delete") {
          this.delete();
        } else if (eventType === "SaveChildForm") {
          this.saveChildData();
        } else {
          this.save();

        }
      }
    });
  }
}
