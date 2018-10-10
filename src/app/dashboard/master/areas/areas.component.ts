import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html'
})

export class AreasComponent implements OnInit {

  public areaForm: FormGroup;
  public businessExecutiveForm: FormGroup;
  private areaEndPoint: string = "area/";
  private beEndPoint: string = "businessexecutive/";
  public gridDataList: any = [];
  public typeaheadDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public selectedTypeahead: any;
  public deleteFlag: boolean =true;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public nameFlag;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  ngOnInit() {
    this.areaForm = this.fb.group({
      areaId: [],
      areaName: ['', Validators.required],
      businessExecutiveId: [],
      businessExecutiveName:[]
    });

    this.businessExecutiveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      mobile: ['', Validators.required]
    });

    this.loadTypeaheadData();
    this.loadGridData();
    this.focusField.nativeElement.focus();
    this.getJsonData();
  }

  loadTypeaheadData() {
    this.masterService.getParentData(this.beEndPoint).subscribe(list => {
      this.typeaheadDataList = list;
    })
  }

  loadGridData() {
    this.masterService.getData(this.areaEndPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      this.gridDataList = this.masterService.mergeObjects(list,this.typeaheadDataList, 'businessExecutiveId', 'id');
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    })
  }

  getJsonData() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["AreaColumns"];
    });
  }

  loadSelectedTypeahead(event) {
      this.selectedTypeahead = event.item;
  }

  openModal(template: TemplateRef<any>) {
    this.resetBusinessExecutiveForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  saveBusinessExecutive() {
      if (this.businessExecutiveForm.valid) {
       
          this.masterService.createRecord(this.beEndPoint, this.businessExecutiveForm.value).subscribe(res => {
            this.modalRef.hide();
            this.businessExecutiveForm.reset();
          }, (error) => {
            this.scServerErrMsg();
          });
        
      } else {
        this.scRequiredErrMsg();
      }
  }

  save() {
    if (this.areaForm.valid) {
     
        if (this.areaForm.value.areaId && this.selectedTypeahead && this.selectedTypeahead.id) {
          this.areaForm.value.businessExecutiveId = this.selectedTypeahead.id;
          this.masterService.updateRecord(this.areaEndPoint, this.areaForm.value).subscribe(res => {
            this.showInformationModal("Save");
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.areaForm.value.businessExecutiveId = this.selectedTypeahead.id;
          this.masterService.createRecord(this.areaEndPoint, this.areaForm.value).subscribe(res => {
            this.showInformationModal("Save");
          }, (error) => {
            this.serverErrMsg();
          });
        }
      
    } else {
      this.requiredErrMsg()
    }
  }

  
  saveForm() {
    this.formRequiredError = false;
    if (this.areaForm.valid ) {
      this.showConfirmationModal("Save");
    } else {
      this.serverErrMsg()
    }
  }


  delete() {
  
      this.masterService.deleteRecord(this.areaEndPoint, this.gridSelectedRow.areaId).subscribe(res => {
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
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  scRequiredErrMsg() {
    this.scFormRequiredError = true;
    this.scFormSuccess = this.scFormServerError = false;
  }

  scServerErrMsg() {
    this.scFormServerError = true;
    this.scFormRequiredError = this.scFormSuccess = false;
  }

  resetForm() {
    this.businessExecutiveForm.reset();
    this.areaForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.areaForm.reset(s);
    this.nameFlag = true;
    this.deleteFlag = false;
  }

  resetBusinessExecutiveForm() {
    this.businessExecutiveForm.reset();
  }

  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'areas.deleteInformationMessage';
      title = 'Area';
    } else if (eventType === "Save") {
      title = 'Area';
      msg = 'areas.saveInformationMessage';
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
      title = 'Area';
      msg = 'areas.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Area';
      msg = 'areas.saveConfirmationMessage';
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
