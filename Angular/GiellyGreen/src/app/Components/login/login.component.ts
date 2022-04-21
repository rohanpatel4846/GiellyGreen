import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordVisible = false;
  loginEmail:any;
  loginPassword:any;
  loginForm!: FormGroup;
  invalidLogin = false;

  constructor(public router:Router, public Login: LoginService, public SessionManagement: SessionManagementService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.SessionManagement.updateIsLoggedIn();
    if(SessionManagementService.isLoggedIn){
      this.router.navigate(['Invoice']);
    }
    this.loginForm = this.fb.group({
      emailLogin: [null, [Validators.email, Validators.required]],
      passwordLogin: [null, [Validators.required]]
    });
  }

  LoginClicked(){
    if (this.loginForm.valid) {
      this.invalidLogin = false;
      this.Login.LoginUser(this.loginForm.value["emailLogin"], this.loginForm.value["passwordLogin"])
      .subscribe((data:any) => { this.AfterLogin(data) }, (error) => {this.invalidLogin = true; console.log(error)});
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  AfterLogin(data:any){
    this.SessionManagement.putCurrentuser(data.userName, data.access_token);
    this.router.navigate(['Invoice']);
  }

}
