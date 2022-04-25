import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionManagementService } from '../SessionManagement/session-management.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  Validations = "https://localhost:44389/api/Validate/";
  constructor(private http: HttpClient, public SessionManagement: SessionManagementService) { }

  getOptions(){
    let user = this.SessionManagement.getCurrentUser();
    let auth = "bearer " + user.token;
    let options = {
      headers: new HttpHeaders().set('Authorization', auth)
    };

    return options;
  }

  validatedEmail(email:any){
    return this.http.get(this.Validations + "Email?email="+email, this.getOptions());
  }

  validateSupplierReff(supplierReff:any){
    return this.http.get(this.Validations + "SupplierRef?supplierRef="+supplierReff, this.getOptions());
  }

  validateVat(vat:any){
    return this.http.get(this.Validations + "VATNumber?vatNumber="+vat, this.getOptions());
  }

  validateTax(tax:any){
    return this.http.get(this.Validations + "TAXReference?taxReference="+tax, this.getOptions());
  }
}
