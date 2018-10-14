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
  selector: 'app-product-group',
  templateUrl: './product-group.component.html'
})
export class ProductGroupComponent implements OnInit {

  public productGroupForm: FormGroup;
  private endPoint: string = "productgroup/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean =true;
  public prodGroup;
  private duplicateProdGroup: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
     private translate: TranslateService,
     private modalService: BsModalService,
     private masterService: MasterService) {  translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productGroupForm = this.fb.group({
      id: [],
      productGroupName:['', Validators.required]
    });
    //this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  onInitialDataLoad(dataList:any[]){
    this.gridDataList = dataList;
  }
  
  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  getDuplicateErrorMessages(): void {
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
     if (this.duplicateProdGroup) {
      this.duplicateMessage = "productgroup.duplicateNameErrorMessage";
      this.duplicateMessageParam=this.productGroupForm.value.productGroupName;
    }
  }

  checkForDuplicateProdGroup() {
    if(!this.nameFlag){
      this.duplicateProdGroup = this.masterService.hasDataExist(this.gridDataList, 'productGroupName', this.productGroupForm.value.productGroupName);
      this.getDuplicateErrorMessages();
    }

  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductGroupColumns"];
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
          if (this.productGroupForm.value.id) {
          this.masterService.updateRecord(this.endPoint, this.productGroupForm.value).subscribe(res => {
            this.showInformationModal("Save");
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord(this.endPoint, this.productGroupForm.value).subscribe(res => {
            this.showInformationModal("Save");
          }, (error) => {
            this.serverErrMsg();
          });
        }
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.productGroupForm.valid && this.duplicateMessage == null ) {
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
    this.productGroupForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productGroupForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
      this.deleteFlag = false;
  }


  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'productgroup.deleteInformationMessage';
      title = 'Product Group';
    } else if (eventType === "Save") {
      title = 'Product Group';
      msg = 'productgroup.saveInformationMessage';
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
      title = 'Product Group';
      msg = 'productgroup.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Product Group';
      msg = 'productgroup.saveConfirmationMessage';
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
