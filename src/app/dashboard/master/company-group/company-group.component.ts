import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-company-group',
  templateUrl: './company-group.component.html'
})
export class CompanyGroupComponent implements OnInit {

    public companyGroupForm: FormGroup;
    private endPoint: string = "companygroup/";
    public gridDataList: any = [];
    public gridColumnNamesList;
    public gridSelectedRow;
    public formSuccess: boolean = false;
    public formRequiredError: boolean = false;
    public formServerError: boolean = false;
    public nameFlag;
    public deleteFlag: boolean =true;
    public saveBtnFlag: boolean =false;
    public companyGrp;
    private duplicateCompanyGrp: boolean = false;
    public duplicateMessage: string = null;
    public duplicateMessageParam: string = null;
    modalRef: BsModalRef;
    message: string;

    @ViewChild('focus') focusField: ElementRef;

    constructor(private fb: FormBuilder,
      private translate: TranslateService,
      private modalService: BsModalService,
      private masterService: MasterService) { translate.setDefaultLang('messages.en');
    }

    ngOnInit() {
      this.companyGroupForm = this.fb.group({
        id: [],
        companyGroup: ['', Validators.required]
      });
      this.loadGridData();
      this.getGridCloumsList();
      this.focusField.nativeElement.focus();
    }

    valueChange(selectedRow: any[]): void {
      this.editable(selectedRow);
    }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
     if (this.duplicateCompanyGrp) {
      this.duplicateMessage = "companygroup.duplicateNameErrorMessage";
      this.duplicateMessageParam=this.companyGroupForm.value.companyGroup;
    }
  }

  checkForDuplicateCompanyGrp() {
      if(!this.nameFlag){
        this.duplicateCompanyGrp = this.masterService.hasDataExist(this.gridDataList, 'companyGroup', this.companyGroupForm.value.companyGroup);
        this.getDuplicateErrorMessages();
      }

  }

    getGridCloumsList() {
      this.masterService.getLocalJsonData().subscribe(data => {
        data as object[];
        this.gridColumnNamesList = data["CompanyGroupColumns"];
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


          if (this.companyGroupForm.value.id) {
            this.masterService.updateRecord(this.endPoint, this.companyGroupForm.value).subscribe(res => {
              this.showInformationModal("Save");
            }, (error) => {
              this.serverErrMsg();
            });
          } else {
            this.masterService.createRecord(this.endPoint, this.companyGroupForm.value).subscribe(res => {
              this.showInformationModal("Save");
            }, (error) => {
              this.serverErrMsg();
            });
          }


    }

    saveForm() {
      this.formRequiredError = false;
      if (this.companyGroupForm.valid && this.duplicateMessage == null) {
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
    }

    requiredErrMsg() {
      if( this.duplicateMessage == null){
        this.formRequiredError = true;
        this.formSuccess = this.formServerError = false;
      }
    }

    serverErrMsg() {
      this.formServerError = true;
      this.formRequiredError = this.formSuccess = false;
    }

    resetForm() {
      this.companyGroupForm.reset();
      this.gridSelectedRow = null;
      this.nameFlag = false;
      this.deleteFlag = true;
      this.saveBtnFlag = false;

      this.formRequiredError = this.formServerError = this.formSuccess = false;
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
        this.saveBtnFlag = this.deleteFlag = !this.gridSelectedRow.deleteFlag;
    }


  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'companygroup.deleteInformationMessage';
      title = 'Company Group';
    } else if (eventType === "Save") {
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
      title = 'Company Group';
      msg = 'companygroup.deleteConfirmationMessage';
    } else if (eventType === "Save") {
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
        }  else {
          this.save();
        }
      }
    });
  }

}
