import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  Invoice = "https://localhost:44389/api/Invoice";

  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  getAllInvoice(){
    //api/Invoice/{id}?monthInvoiceId={monthInvoiceId}
    return this.http.get(this.Invoice, this.getOptions());
  }

  getInvoiceByID(id:any){
    return this.http.get(this.Invoice + "/" + id, this.getOptions());
  }

  getByMonthID(monthId:any){
    return this.http.get(this.Invoice + "?monthInvoiceId="+monthId, this.getOptions());
  }

  postInvoice(body:any){
    return this.http.post(this.Invoice, body, this.getOptions());
  }

  putInvoice(id:any, body:any){
    return this.http.put(this.Invoice + "/" + id, body, this.getOptions());
  }
}
