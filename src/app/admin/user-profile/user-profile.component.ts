import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import '../../../assets/styles/mainstyles.scss';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public userProfileForm: FormGroup;
  public badCredentials: boolean;
  public formError: boolean;

  constructor(
    private fb: FormBuilder,
    // private authService: AuthenticationService
  ) { }

  ngOnInit()  {
  
    this.userProfileForm = this.fb.group({
      clientId:['', Validators.required],
      id:['', Validators.required],
      name:['', Validators.required],
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


      // password: ['', Validators.required],
      // email: ['', Validators.required],
      // roles: ['', Validators.required],
      // confPassword: ['', Validators.required], 
      // address: ['', Validators.required],     
      // town: ['', Validators.required],
      // designation: ['', Validators.required],
      // mobile: ['', Validators.required]
    });

    // this.authService.badCredentials.subscribe(res => {
    //   this.badCredentials = res;
    // })
  }

  // signup() {
  //   //this.isUnauthorized = false;
  //   // console.log(this.loginForm.value);
  //   if(this.userProfileForm.valid){
  //     this.authService.authenticateUser(this.userProfileForm.value);
  //   }else{
  //     this.formError = true;
  //   }
  // }


}
