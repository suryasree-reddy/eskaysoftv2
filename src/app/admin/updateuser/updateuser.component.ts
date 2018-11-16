import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss']
})
export class UpdateuserComponent implements OnInit {

  private updateUserForm: FormGroup;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {
    this.updateUserForm = this.fb.group({
      userId:['', Validators.required],
      name:['', Validators.required],
      username: ['', Validators.required],

    });

  }

}
