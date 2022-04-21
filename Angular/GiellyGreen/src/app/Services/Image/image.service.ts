import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  ImageUpload = "https://localhost:44389/api/Image/";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  postImage(body:any){
    return this.http.post(this.ImageUpload, body, this.getOptions());
  }

  getImage(id:any){
    return this.http.get(this.ImageUpload + id, this.getOptions());
  }
}
