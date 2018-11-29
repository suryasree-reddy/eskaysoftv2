import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  private purcahseReportForm: FormGroup;
  private companyForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "reports/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  public companyList: any = [];

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  ngOnInit() {
    this.purcahseReportForm = this.fb.group({
      id: ['', Validators.required],
      number: ['', Validators.required],
      companyId:[],
      gsttype:[],
      fromDate:[],
      toDate:[],
      repType:[],
      custOption:[],

    });
    this.companyForm = this.fb.group({
      id: [],
      companyName: ['', Validators.required]
    });
    this.loadCompanyData();

  }

  loadCompanyData() {
    this.masterService.getParentData("company/").subscribe(list => {
      this.companyList = list;
    })
  }

  onSelectCompany(event) {
    this.purcahseReportForm.patchValue({ companyId: event.item.id });
    this.purcahseReportForm.patchValue({ companyName: event.item.companyName });
  }

  resetForm() {
    this.purcahseReportForm.reset();
    this.endPoint = "reports/";
    this.deleteFlag = true;
    this.nameFlag = false;
    this.companyForm.reset();
  }

}
