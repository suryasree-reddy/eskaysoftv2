import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import '../../../assets/styles/mainstyles.scss';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public badCredentials: boolean;
  public formError: boolean;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      name:['', Validators.required],
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
