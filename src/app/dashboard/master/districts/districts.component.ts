import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';

@Component({
  selector: 'app-districts',
  templateUrl: './districts.component.html'
})
export class DistrictsComponent implements OnInit {
  public districtsForm: FormGroup;
  public statesForm: FormGroup;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public districtsList: any = [];
  public statesList: any = [];
  public districtsColumns;
  public editDistricts;
  public nameFlag;
  public selectedState:any;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }
  openModal(template: TemplateRef<any>) {
    //this.resetScheduleForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  ngOnInit() {
    this.statesForm = this.fb.group({
      id: [],
      stateName: ['', Validators.required],
      stateCode: ['', Validators.required],
      zone: ['', Validators.required],
    });
    this.districtsForm = this.fb.group({
      id: [],
      districtsName: ['', Validators.required],
      stateId: [],
      stateName: []
    });

    this.loadStatesData();
    this.loadGridData();
    this.focusField.nativeElement.focus();
    this.getDistrictsTypes();
  }

  loadStatesData() {
    this.masterService.getParentData("states/").subscribe(list => {
      this.statesList = list;
    })
  }

  loadGridData() {
    this.masterService.getData("districts/");
    this.masterService.dataObject.subscribe(list => {
      this.districtsList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.districtsList.length));
    });
  }

  getDistrictsTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
       data as object [];
        this.districtsColumns = data["DistrictsColumns"]
    });
  }

  onSelectState(event) {
    this.selectedState = event.item;
  }

  save() {
    if (this.districtsForm.valid) {
      if (confirm('Are you sure!!')) {
        if (this.districtsForm.value.id) {
          this.masterService.updateRecord('districts/', this.districtsForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord('districts/', this.districtsForm.value).subscribe(res => {
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

  saveState() {
    if (confirm('Are you sure!!')) {

      if (this.statesForm.valid) {
        this.masterService.createRecord("states/", this.statesForm.value).subscribe(res => {
            this.modalRef.hide();
          this.statesForm.reset();

        }, (error) => {
          this.scServerErrMsg();
        });

      } else {
        this.scRequiredErrMsg();
      }
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord('districts/', this.editDistricts.id).subscribe(res => {
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
    this.districtsForm.reset();
    this.editDistricts = null;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }
  resetStatesForm(){
    this.statesForm.reset();
  }
  editable(s) {
    this.editDistricts = s;
    this.districtsForm.reset(s);
    this.nameFlag = true;
  }

}
