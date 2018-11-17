import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})

export class ChangepasswordComponent implements OnInit {

  private changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder,

    private sharedDataService: SharedDataService,
    private masterService: MasterService) {  }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      roles: ['', Validators.required],
      confPassword: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      designation: ['', Validators.required],
      mobile: ['', Validators.required]
    });
  }

}
