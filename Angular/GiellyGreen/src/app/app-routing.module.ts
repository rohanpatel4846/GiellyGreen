import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InvoiceComponent } from './Components/invoice/invoice.component';
import { LoginComponent } from './Components/login/login.component';
import { SupplierComponent } from './Components/supplier/supplier.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component:LoginComponent},
  { path: "Supplier", component:SupplierComponent},
  { path: "Invoice", component:InvoiceComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
