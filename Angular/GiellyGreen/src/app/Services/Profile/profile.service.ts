import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  Profile = "https://localhost:44389/api/Profile";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  getLastProfile(){
    return this.http.get(this.Profile, this.getOptions());
  }

  postSupplier(body:any){
    return this.http.post(this.Profile, body, this.getOptions());
  }
}
