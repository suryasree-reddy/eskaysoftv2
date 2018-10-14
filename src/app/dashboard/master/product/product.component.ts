import { Component, OnInit, TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  public productForm: FormGroup;
  public productGroupName: FormGroup;
  public productCategoryForm: FormGroup;
  private endPoint: string = "product/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean =true;
  public duplicateMessage: string = null;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, private translate: TranslateService, private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      productCategory: ['', Validators.required],
      code:[],
      name: ['', Validators.required],
      packing: ['', Validators.required],
      boxQty: ['', Validators.required],
      productGroupId: ['', Validators.required],
      caseQty: ['', Validators.required],
      productCategoryId: ['', Validators.required],
      netRate: ['', Validators.required],
      isNetRateItem: ['', Validators.required],
      schemeQty: ['', Validators.required],
      free: ['', Validators.required],
      contents: ['', Validators.required],
      tax: ['', Validators.required],
    });
    this.loadGridData();
    this.getGridCloumsList();
    // this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductColumns"];
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
    if (this.productForm.valid) {
      if (confirm('Are you sure!!')) {
        if (this.productForm.value.id) {
          this.masterService.updateRecord(this.endPoint, this.productForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord(this.endPoint, this.productForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        }
      }
    } else {
      this.requiredErrMsg()
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
        localStorage.removeItem('ag-activeRow');
        this.successMsg()
      }, (error) => {
        this.serverErrMsg();
      });
    }
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
    this.productForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
      this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
      this.deleteFlag = false;
  }

}
