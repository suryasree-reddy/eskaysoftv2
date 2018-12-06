import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import * as _ from 'lodash';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html'
})

export class AreasComponent implements OnInit {

  public areaForm: FormGroup;
  private areaEndPoint: string = "area/";
  private beEndPoint: string = "businessexecutive/";
  @Input() gridDataList: any = [];
  public typeaheadDataList: any = [];
  public gridSelectedRow;
  public deleteFlag: boolean = true;
  public formRequiredError: boolean = false;
  public formSuccess: boolean = false;
  public nameFlag;
  public areaName;
  private duplicateAreaName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-5";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  ngOnInit() {
    this.areaForm = this.fb.group({
      id: [],
      areaName: ['', Validators.required],
      businessExecutiveId: [],
      businessExecutiveName: []
    });
    this.loadTypeaheadData();
    this.focusField.nativeElement.focus();
  }

  loadTypeaheadData() {
    this.masterService.getParentData(this.beEndPoint).subscribe(list => {
      this.typeaheadDataList = list;
    });
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    if (!this.nameFlag) {
      this.duplicateAreaName = this.masterService.hasDataExist(this.gridDataList, 'areaName', this.areaForm.value.areaName);
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateAreaName) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }
    if (this.duplicateAreaName) {
      this.duplicateMessage = "areas.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.areaForm.value.areaName;
      this.formRequiredError = false;
    }
  }

  loadGridData() {
    this.masterService.getData(this.areaEndPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      this.gridDataList = this.masterService.mergeObjects(list, this.typeaheadDataList, 'businessExecutiveId', 'id');
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    })
  }

  loadSelectedTypeahead(event) {
    this.areaForm.patchValue({ businessExecutiveId: event.item.id });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
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

  resetForm() {
    this.areaForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formSuccess = false;
    if (!this.isModelWindowView) {
      this.loadGridData();
    }
    this.formRequiredError = false;
    this.duplicateAreaName = false;
    this.duplicateMessage = null;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.areaForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }

}
