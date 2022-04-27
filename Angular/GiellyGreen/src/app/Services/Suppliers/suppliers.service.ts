import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  Supplier = "https://localhost:44389/api/Supplier";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  getAllSupplier(){
    return this.http.get(this.Supplier + "/All/", this.getOptions());
  }

  getActiveSupplier(){
    return this.http.get(this.Supplier + "/onlyActive/", this.getOptions());
  }

  getSupplierByID(id:any){
    return this.http.get(this.Supplier + "/All/"+id, this.getOptions());
  }

  patchIsActive(id:any, isActive:any, body:any){
    return this.http.patch(this.Supplier + `/`+id+`?isActive=`+isActive, {}, this.getOptions());
    //return this.http.put(this.Supplier + "/"+body.id, body, this.getOptions());
  }

  deleteSupplier(id:any){
    return this.http.delete(this.Supplier + `/`+id, this.getOptions());
  }

  postSupplier(body:any){
    return this.http.post(this.Supplier, body, this.getOptions());
  }

  putSupplier(body:any){
    return this.http.put(this.Supplier + "/"+body.id, body, this.getOptions());
  }
}
