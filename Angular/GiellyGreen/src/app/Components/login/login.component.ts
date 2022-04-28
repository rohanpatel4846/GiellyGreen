import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/Services/Login/login.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  loadingLogin = false;

  constructor(private notification: NzNotificationService, public router:Router, public Login: LoginService, public SessionManagement: SessionManagementService, private fb: FormBuilder) { }

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
      this.loadingLogin = true;
      this.Login.LoginUser(this.loginForm.value["emailLogin"], this.loginForm.value["passwordLogin"])
      .subscribe((data:any) => { this.AfterLogin(data) }, (error) => {this.HandleLoginError(error)});
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  HandleLoginError(error:any){
    this.loadingLogin = false;
    if(error.error.error_description == "The user name or password is incorrect."){
      this.invalidLogin = true;
    }
    else{
      this.serverErrorNotification(error);
    }
  }

  serverErrorNotification(DataString:any): void {
    console.log(DataString);
    this.notification.create(
      'error',
      'Error From Server!',
      DataString.message
    );
  }

  AfterLogin(data:any){
    this.loadingLogin = false;
    this.SessionManagement.putCurrentuser(data.userName, data.access_token);
    this.router.navigate(['Invoice']);
  }

}
