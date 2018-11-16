import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

export class UserProfileComponent implements OnInit {

  private userProfileForm: FormGroup;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {

    this.userProfileForm = this.fb.group({
      clientId: ['', Validators.required],
      id: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
      address1: [],
      address2: [],
      town: [],
      pin: [],
      district: [],
      state: [],
      statecode: [],
      phoneLand1: [],
      mobile1: [],
      mobile2: [],
      contactPerson: [],
      cPersonMobile: [],
      natureofbusiness: [],
      bank1: [],
      bankacno1: [],
      bankifsc1: [],
      bank2: [],
      bankacno2: [],
      bankifsc2: [],

    });


  }




}
