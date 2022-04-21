import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionManagementService {
  public static isLoggedIn = false;

  constructor() {
  }

  getCurrentUser(){
    let user = JSON.parse(sessionStorage.getItem('user') || "{}");
    return user;
  }

  putCurrentuser(email:any, token:any){
    let user = {
      email: email,
      token: token
    }
    sessionStorage.setItem('user', JSON.stringify(user));
    SessionManagementService.isLoggedIn = false;
  }

  deleteCurrentuser(){
    sessionStorage.setItem('user', "{}");
    SessionManagementService.isLoggedIn = false;

  }

  updateIsLoggedIn(){
    SessionManagementService.isLoggedIn = (!(this.getCurrentUser().email == undefined));
  }
}
