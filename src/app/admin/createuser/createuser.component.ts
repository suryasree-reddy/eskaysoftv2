import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import '../../../assets/styles/mainstyles.scss';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {

  public createUserForm: FormGroup;
  public badCredentials: boolean;
  public formError: boolean;
  
  constructor(
    private fb: FormBuilder,
  ) { }

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
