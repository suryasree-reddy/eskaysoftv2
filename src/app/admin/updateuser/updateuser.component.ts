import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import '../../../assets/styles/mainstyles.scss';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss']
})
export class UpdateuserComponent implements OnInit {

  public updateUserForm: FormGroup;
  public badCredentials: boolean;
  public formError: boolean;
  
  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.updateUserForm = this.fb.group({
      userId:['', Validators.required],
      name:['', Validators.required],
      username: ['', Validators.required],
 
    });

  }

}
