import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  Email = "https://localhost:44389/api/Email";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }
  
  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  sendEmail(body:any){
    return this.http.post(this.Email, body, this.getOptions());
  }
}
