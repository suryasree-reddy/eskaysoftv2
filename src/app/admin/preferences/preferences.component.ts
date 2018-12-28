import { Component, OnInit, NgModule, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModelDialogComponent } from 'src/app/commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})


@NgModule({
imports: [
   BsDropdownModule.forRoot(),
   TypeaheadModule.forRoot(),
       TabsModule.forRoot()
  ],
 })

export class PreferencesComponent implements OnInit {
  private PreferencesForm: FormGroup;
 
  modalRef: BsModalRef

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private _routeParams: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }


  ngOnInit() {
    this.PreferencesForm =this.fb.group({
     
    });

    
    
  }

  
}
