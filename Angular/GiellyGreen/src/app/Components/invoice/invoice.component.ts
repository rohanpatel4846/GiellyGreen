import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';
import { MonthInvoiceService } from 'src/app/Services/MonthInvoice/month-invoice.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import { SuppliersService } from 'src/app/Services/Suppliers/suppliers.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EmailService } from 'src/app/Services/Email/email.service';
import Swal from 'sweetalert2';
import { PdfService } from 'src/app/Services/PDF/pdf.service';
import { saveAs } from 'file-saver'



@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  menuOpened = false;
  monthFormat = 'MM/yyyy';
  selectedMonth:any;
  selectedMonthMONTH:any;
  selectedMonthYEAR:any;
  selectedDate:any;
  invoiceReference:any;
  allChecked:any;
  Custom1Head = "Custom 1";
  Custom2Head = "Custom 2";
  Custom3Head = "Custom 3";
  Custom4Head = "Custom 4";
  Custom5Head = "Custom 5";
  monthSelected:boolean = false;
  GlobalVAT = 20;
  currentID = 0;
  invoiceTableLoading = false;
  invoiceFromDataBase:any = [];
  FullPageLoading = false;

  listOfInvoices: InvoiceItem[] = [];

  getNet(data:any){
    let total = data.HairService + data.BeautyService + data.Custom1 + data.Custom2 + data.Custom3 + data.Custom4 + data.Custom5;
    return total;
  }

  getVAT(total:any){
    return ((total * this.GlobalVAT ) / 100);
  }

  allCheckedChanged(){
    this.listOfInvoices.forEach((element:any) => {
      element.isChecked = this.allChecked;
    });
  }

  constructor(public Pdf:PdfService, public Email:EmailService, public Suppliers:SuppliersService,public Invoice:InvoiceService, public router:Router, public SessionManagement: SessionManagementService, public MonthInvoice:MonthInvoiceService) { }

  ngOnInit(): void {
    this.SessionManagement.updateIsLoggedIn();
    console.log(SessionManagementService.isLoggedIn);
    if(!SessionManagementService.isLoggedIn){
      this.router.navigate(['login']);
    }
  }

  MonthSelectedChanged(){
    if(this.selectedMonth != null){
      this.monthSelected = true;
      this.selectedMonthMONTH = String(this.selectedMonth.getUTCMonth() + 1);
      this.selectedMonthYEAR = String(this.selectedMonth.getUTCFullYear());
      let invoiceID = this.selectedMonthMONTH + this.selectedMonthYEAR;
      this.invoiceReference = invoiceID;

      this.MonthInvoice.getAllMonthInvoice()
      .subscribe((data:any) => {
        this.AfterMonthInvoice(data);
      });
    }
  }

  AfterMonthInvoice(data:any){
    let result = data.Result;
    let exists = false;
    result.forEach((monthINV:any) => {
      if(monthINV.monthNUM == this.selectedMonth.getUTCMonth() + 1 && monthINV.yearNUM == this.selectedMonth.getUTCFullYear()){
        exists = true;
        this.currentID = monthINV.id;
      }
    });

    if(exists){
      this.MonthInvoiceGenerated(this.currentID);
    }
    else{
      let MonthInvoiceBody = {
        "monthNUM": this.selectedMonth.getUTCMonth() + 1,
        "yearNUM": this.selectedMonth.getUTCFullYear(),
        "Custom1_Name": this.Custom1Head,
        "Custom2_Name": this.Custom2Head,
        "Custom3_Name": this.Custom3Head,
        "Custom4_Name": this.Custom4Head,
        "Custom5_Name": this.Custom5Head,
        "InvoiceDate": this.selectedDate,
        "VAT": this.GlobalVAT,
        "InvoiceReferenceNumber": this.invoiceReference
      }

      this.MonthInvoice.postMonthInvoice(MonthInvoiceBody)
        .subscribe((data:any) => {
          if(data.Result == 1){
            this.MonthSelectedChanged();
          }
        });
    }
  }

  MonthInvoiceGenerated(id:any){
    this.MonthInvoice.getMonthInvoiceById(id)
    .subscribe((data:any) => {
      let result = data.Result[0];
      this.Custom1Head = result.Custom1_Name;
      this.Custom2Head = result.Custom2_Name;
      this.Custom3Head = result.Custom3_Name;
      this.Custom4Head = result.Custom4_Name;
      this.Custom5Head = result.Custom5_Name;
      this.selectedDate = result.InvoiceDate;
      this.GlobalVAT = result.VAT;
      this.invoiceReference = result.InvoiceReferenceNumber;

      //---------------------------------

      this.GetInvoices();
    });
  }

  GetInvoices(){
    this.invoiceTableLoading = true;
    let tableData: InvoiceItem[] = [];
    this.Invoice.getByMonthID(this.currentID)
      .subscribe((data:any) => {
        this.Suppliers.getAllSupplier()
        .subscribe((AllSuppliers:any) => {
          data.Result.forEach((invoice:any) => {
            this.invoiceTableLoading = false;
            let invoiceOBJ:InvoiceItem = {
              id: invoice.id,
              SupplierName: AllSuppliers.Result.find((x:any) => x.id == invoice.SupplierId).SupplierName,
              HairService: invoice.HairService,
              BeautyService: invoice.BeautyService,
              Custom1: invoice.Custom1,
              Custom2: invoice.Custom2,
              Custom3: invoice.Custom3,
              Custom4: invoice.Custom4,
              Custom5: invoice.Custom5,
              AdvancePay: invoice.AdvancePay,
              isChecked: false,
              isApproved: invoice.isApproved,
              SupplierID: invoice.SupplierId
            }
            tableData.push(invoiceOBJ);
            this.invoiceFromDataBase.push(invoiceOBJ);
          });
          
          this.invoiceTableLoading = true;
          this.Suppliers.getActiveSupplier()
            .subscribe((data:any) => {
              this.invoiceTableLoading = false;
              data.Result.forEach((supplier:any) => {
                let invoiceOBJ:InvoiceItem = {
                  id: 0,
                  SupplierName: supplier.SupplierName,
                  HairService: 0,
                  BeautyService: 0,
                  Custom1: 0,
                  Custom2: 0,
                  Custom3: 0,
                  Custom4: 0,
                  Custom5: 0,
                  AdvancePay: 0,
                  isChecked: false,
                  isApproved: false,
                  SupplierID: supplier.id
                }
  
                if(tableData.findIndex( x => x.SupplierID == supplier.id) == -1)
                  tableData.push(invoiceOBJ);
              });
              this.listOfInvoices = tableData;
            });
        })
      });
  }

  UpdateMonthInvoice(){
    let MonthInvoiceBody = {
      "monthNUM": this.selectedMonth.getUTCMonth() + 1,
      "yearNUM": this.selectedMonth.getUTCFullYear(),
      "Custom1_Name": this.Custom1Head,
      "Custom2_Name": this.Custom2Head,
      "Custom3_Name": this.Custom3Head,
      "Custom4_Name": this.Custom4Head,
      "Custom5_Name": this.Custom5Head,
      "InvoiceDate": this.selectedDate,
      "VAT": this.GlobalVAT,
      "InvoiceReferenceNumber": this.invoiceReference
    }

    this.MonthInvoice.putMonthInvoice(this.currentID, MonthInvoiceBody)
    .subscribe((data:any) => {
      console.log(data);
    });
  }

  totalNet(){
    let total = 0;
    this.listOfInvoices.forEach(element => {
      total += this.getNet(element);
    });
    return total;
  }

  totalVat(){
    let total = 0;
    this.listOfInvoices.forEach(element => {
        total += this.getVAT(this.getNet(element));
    });
    return total;
  }

  totalGross(){
    let total = 0;
    this.listOfInvoices.forEach(element => {
        total += this.getNet(element) + this.getVAT(this.getNet(element))
    });
    return total;
  }

  totalAdvancePaid(){
    let total = 0;
    this.listOfInvoices.forEach(element => {
        total += element.AdvancePay;
    });
    return total;
  }

  totalBalanceDue(){
    let total = 0;
    this.listOfInvoices.forEach(element => {
        total += this.getNet(element) + this.getVAT(this.getNet(element)) - element.AdvancePay;
    });
    return total;
  }

  saveButtonClicked(){
    let toUpdateORAdd:any = [];
    this.listOfInvoices.forEach((invoice:any) => {
      if((this.getNet(invoice) != 0 || invoice.AdvancePay != 0 || this.invoiceFromDataBase.findIndex((x:any) =>x.id == invoice.id) != -1) && !invoice.isApproved){
        toUpdateORAdd.push(invoice);
      }
    });

    let totalApiCalls = toUpdateORAdd.length;
    let completedApis = 0;

    toUpdateORAdd.forEach((invoive:any) => {
      this.FullPageLoading = true;
      let InvoiceBody = {
        "id": invoive.id,
        "MonthId": this.currentID,
        "SupplierId": invoive.SupplierID,
        "HairService": invoive.HairService,
        "BeautyService": invoive.BeautyService,
        "Custom1": invoive.Custom1,
        "Custom2": invoive.Custom2,
        "Custom3": invoive.Custom3,
        "Custom4": invoive.Custom4,
        "Custom5": invoive.Custom5,
        "AdvancePay": invoive.AdvancePay,
        "isApproved": invoive.isApproved
      }

      if(invoive.id == 0){
        this.Invoice.postInvoice(InvoiceBody)
          .subscribe((data:any) => {
            completedApis++;
            if(completedApis >= totalApiCalls){
              this.AfterAllPostPut();
            }
          });
      }
      else{
        this.Invoice.putInvoice(invoive.id, InvoiceBody)
          .subscribe((data:any) => {
            completedApis++;
            if(completedApis >= totalApiCalls){
              this.AfterAllPostPut();
            }
          });
      }
    });

    this.invoiceFromDataBase = [];
  }

  AfterAllPostPut(){
    this.GetInvoices();
    this.FullPageLoading = false;
  }

  valueChanged(){
    this.listOfInvoices.forEach((invoice:any) => {
      invoice.HairService = invoice.HairService == "" ? 0 : invoice.HairService;
      invoice.BeautyService = invoice.BeautyService == "" ? 0 : invoice.BeautyService;
      invoice.Custom1 = invoice.Custom1 == "" ? 0 : invoice.Custom1;
      invoice.Custom2 = invoice.Custom2 == "" ? 0 : invoice.Custom2;
      invoice.Custom3 = invoice.Custom3 == "" ? 0 : invoice.Custom3;
      invoice.Custom4 = invoice.Custom4 == "" ? 0 : invoice.Custom4;
      invoice.Custom5 = invoice.Custom5 == "" ? 0 : invoice.Custom5;
      invoice.AdvancePay = invoice.AdvancePay == "" ? 0 : invoice.AdvancePay;
    });
  }

  getCheckedInvoices(){
    let checked:any = [];
    this.listOfInvoices.forEach((element:any) => {
      if(element.isChecked){
        checked.push(element);
      }
    });
    return checked;
  }

  approveSelectedClicked(){
    let checked:any = this.getCheckedInvoices();
    this.listOfInvoices.forEach((invoice:any) => {
      console.log(checked.findIndex((x:any) => x.SupplierID == invoice.SupplierID));
      if(checked.findIndex((x:any) => x.SupplierID == invoice.SupplierID) != -1){
        invoice.isApproved = true;
      }
    });

    this.allChecked = false;
    this.allCheckedChanged();
  }

  printClicked(){
    let divToPrint:any = document.getElementById("toPrintDIV");
    let newWin:any = window.open("");
    newWin.document.write('<html><head><title>Self Billing Invoice</title>');
    newWin.document.write(`<link rel="stylesheet" href="styles.css">`);
    newWin.document.write('</head><body>');
    newWin.document.write(divToPrint.outerHTML);
    newWin.document.write('</body></html>'); 
    setTimeout(function(){
      newWin.print();
      newWin.close();
    }, 100);
  }

  combineAndSave(){
    this.FullPageLoading = true;
    let body:any = [];
    this.getCheckedInvoices().forEach((invoice:any) => {
      body.push(invoice.id);
    });

    this.Pdf.getPDF(body)
    .subscribe((data:any) => { this.AfterCombineAPISuccess(data) }, (error) => { console.log(error) });
  }

  AfterCombineAPISuccess(data:any){
    let fileContent = data.Result;
    const file = new Blob([content], {type: 'text/plain'});
    FileSaver.saveAs(file, "test.txt");
  }

  sendEmailToSelected(){
    this.FullPageLoading = true;
    let body:any = [];
    this.getCheckedInvoices().forEach((invoice:any) => {
      body.push(invoice.id);
    });

    this.Email.sendEmail(body)
    .subscribe((data:any) => { this.EmailSuccess(data) }, (error) => { console.log(error) });
  }

  EmailSuccess(data:any){
    this.FullPageLoading = false;
    Swal.fire({
      icon: 'success',
      title: 'Email Sent',
      showConfirmButton: false,
    })
  }
}

interface InvoiceItem {
  id: number;
  SupplierName: string;
  SupplierID: number;
  HairService: number;
  BeautyService: number;
  Custom1: number;
  Custom2: number;
  Custom3: number;
  Custom4: number;
  Custom5: number;
  AdvancePay: number;
  isChecked: boolean;
  isApproved: boolean;
}

