import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class MonthInvoiceService {
  MonthInvoice = "https://localhost:44389/api/MonthInvoice";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  getAllMonthInvoice(){
    return this.http.get(this.MonthInvoice, this.getOptions());
  }

  getMonthInvoiceById(id:any){
    return this.http.get(this.MonthInvoice + "/" + id, this.getOptions());
  }

  postMonthInvoice(body:any){
    return this.http.post(this.MonthInvoice, body, this.getOptions());
  }

  putMonthInvoice(id:any, body:any){
    return this.http.put(this.MonthInvoice + "/" + id, body, this.getOptions());
  }
}
