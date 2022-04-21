import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploaderService {
  ImageUpload = "https://localhost:44389/api/ImageUploader";
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

  getImage(address:any){
    return this.http.get(this.ImageUpload + "?imageName=" + address, this.getOptions());
  }
}
