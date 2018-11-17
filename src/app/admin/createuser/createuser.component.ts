import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})

export class CreateuserComponent implements OnInit {

  private createUserForm: FormGroup;

  constructor(private fb: FormBuilder,

    private sharedDataService: SharedDataService,
    private masterService: MasterService) {  }

  ngOnInit() {
    this.createUserForm = this.fb.group({
      id:['', Validators.required],
      name:['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required],
      address: [],
      town: [],
      pin: [],
      district: [],
      state: [],
      phone: [],
      mobile: [],
      email: ['', Validators.required],
      roles: ['', Validators.required],
      designation: [],
    });

  }

}
