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
    let user = JSON.parse(localStorage.getItem('user') || "{}");
    return user;
  }

  putCurrentuser(email:any, token:any){
    let user = {
      email: email,
      token: token
    }
    localStorage.setItem('user', JSON.stringify(user));
    SessionManagementService.isLoggedIn = false;
  }

  deleteCurrentuser(){
    localStorage.setItem('user', "{}");
    SessionManagementService.isLoggedIn = false;
  }

  updateIsLoggedIn(){
    SessionManagementService.isLoggedIn = (!(this.getCurrentUser().email == undefined));
  }
}
