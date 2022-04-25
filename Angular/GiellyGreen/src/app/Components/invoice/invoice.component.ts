import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';
import { MonthInvoiceService } from 'src/app/Services/MonthInvoice/month-invoice.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import { SuppliersService } from 'src/app/Services/Suppliers/suppliers.service';

import { EmailService } from 'src/app/Services/Email/email.service';
import Swal from 'sweetalert2';
import { PdfService } from 'src/app/Services/PDF/pdf.service';
import * as FileSaver from 'file-saver';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  FullPageLoading = false;
  changedInvoices:any = [];
  dateFormatSelectDate="dd/MM/yyyy";
  NonDataBaseChanged = false;

  listOfInvoices: InvoiceItem[] = [];
  listOfInvoicesBackup: InvoiceItem[] = [];

  logOut(){
    Swal.fire({
      title: 'Logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.SessionManagement.deleteCurrentuser();
        this.router.navigate(['login']);
      }
    })
  }
  
  getNet(data:any){
    let total = data.HairService + data.BeautyService + data.Custom1 + data.Custom2 + data.Custom3 + data.Custom4 + data.Custom5;
    return total;
  }

  getDue(data:any){
    let due:any = this.getNet(data) + this.getVAT(this.getNet(data)) - data.AdvancePay
    due = due.toFixed(2);

    if(due < 0){
      due = "(" + due + ")";
    }
    return due;
  }

  getVAT(total:any){
    return ((total * this.GlobalVAT ) / 100);
  }

  allCheckedChanged(){
    this.listOfInvoices.forEach((element:any) => {
      element.isChecked = this.allChecked;
    });
  }

  constructor(private notification: NzNotificationService, public Pdf:PdfService, public Email:EmailService, public Suppliers:SuppliersService,public Invoice:InvoiceService, public router:Router, public SessionManagement: SessionManagementService, public MonthInvoice:MonthInvoiceService) { }

  ngOnInit(): void {
    this.SessionManagement.updateIsLoggedIn();
    if(!SessionManagementService.isLoggedIn){
      this.router.navigate(['login']);
    }
  }

  MonthSelectedChanged(){
    if(this.selectedMonth != null){
      this.monthSelected = true;
      this.selectedMonthMONTH = String(this.selectedMonth.getUTCMonth() + 1);
      this.selectedMonthYEAR = String(this.selectedMonth.getUTCFullYear());
      let invoiceID = this.getMonthName(this.selectedMonthMONTH) + this.selectedMonthYEAR;
      this.invoiceReference = invoiceID;
      let LastDateOfMonth = new Date(this.selectedMonth.getUTCFullYear(),this.selectedMonth.getUTCMonth(), this.getLastDate(this.selectedMonth.getUTCFullYear(), this.selectedMonth.getUTCMonth() + 1) + 1);
      this.selectedDate = LastDateOfMonth;
      this.MonthInvoice.getAllMonthInvoice()
      .subscribe((data:any) => {
        this.AfterMonthInvoice(data);
      }
      , (error) => { this.serverErrorNotification(error) } );
    }
  }

  getLastDate(year:any, month:any){
    let isLeap = year % 4 == 0;
    switch(month){
      case 1 : return 31;
      case 2 : return isLeap ? 29 : 28;
      case 3 : return 31;
      case 4 : return 30;
      case 5 : return 31;
      case 6 : return 30;
      case 7 : return 31;
      case 8 : return 31;
      case 9 : return 30;
      case 10 : return 31;
      case 11 : return 30;
      case 12 : return 31;
      default: return 0;
    }
  }

  getMonthName(monthNum:any){
    switch(monthNum){
      case "1" : return "January";
      case "2" : return "February";
      case "3" : return "March";
      case "4" : return "April";
      case "5" : return "May";
      case "6" : return "June";
      case "7" : return "July";
      case "8" : return "August";
      case "9" : return "September";
      case "10" : return "October";
      case "11" : return "November";
      case "12" : return "December";
      default: return "Invalid Month";
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

      this.FullPageLoading=true;
      this.MonthInvoice.postMonthInvoice(MonthInvoiceBody)
        .subscribe((data:any) => {
          if(data.Result == 1){
            this.MonthSelectedChanged();
            this.FullPageLoading=false;
          }
        }, (error) => { this.serverErrorNotification(error) });
    }
  }

  MonthInvoiceGenerated(id:any){
    this.FullPageLoading=true;
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
      this.FullPageLoading=false;
      //---------------------------------

      this.GetInvoices();
    }, (error) => { this.serverErrorNotification(error) });
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
  
                if(tableData.findIndex( x => x.SupplierID == supplier.id) == -1){
                  tableData.push(invoiceOBJ);
                }
              });
              this.listOfInvoices = tableData;
            }, (error) => { this.serverErrorNotification(error) });
        })
      }, (error) => { this.serverErrorNotification(error) });
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
    }, (error) => { this.serverErrorNotification(error) });
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
    let toUpdateORAddFinal:any = [];
    this.changedInvoices = this.changedInvoices.filter((item:any, i:any, ar:any) => ar.indexOf(item) === i);

    this.changedInvoices.forEach((id:any) => {
      toUpdateORAdd.push(this.listOfInvoices.find((x:any) => x.id == id));
    });

    toUpdateORAdd.forEach((invoice:any) => {
      if(invoice.id != 0 || this.getNet(invoice) != 0 || invoice.AdvancePay != 0){
        toUpdateORAddFinal.push(invoice);
      }
    });
    toUpdateORAdd = toUpdateORAddFinal;

    this.listOfInvoices.forEach((invoice:any) => {
      if(invoice.id == 0 && (this.getNet(invoice) > 0 || invoice.AdvancePay > 0)){
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
          }, (error) => { this.serverErrorNotification(error) });
      }
      else{
        this.Invoice.putInvoice(invoive.id, InvoiceBody)
          .subscribe((data:any) => {
            completedApis++;
            if(completedApis >= totalApiCalls){
              this.AfterAllPostPut();
            }
          }, (error) => { this.serverErrorNotification(error) });
      }
    });

    if(toUpdateORAdd.length == 0){
      this.AfterAllPostPut();
    }
  }

  AfterAllPostPut(){
    this.changedInvoices = [];
    this.NonDataBaseChanged = false;
    this.GetInvoices();
    this.FullPageLoading = false;
  }

  valueChanged(id:any, event:any){
    let invoiceArray = this.listOfInvoices;
    let index = invoiceArray.findIndex(x=>x.id == id);
    invoiceArray[index].HairService = invoiceArray[index].HairService <= 0 ? 0 : invoiceArray[index].HairService;
    invoiceArray[index].BeautyService = invoiceArray[index].BeautyService <= 0 ? 0 : invoiceArray[index].BeautyService;
    invoiceArray[index].Custom1 = invoiceArray[index].Custom1 <= 0 ? 0 : invoiceArray[index].Custom1;
    invoiceArray[index].Custom2 = invoiceArray[index].Custom2 <= 0 ? 0 : invoiceArray[index].Custom2;
    invoiceArray[index].Custom3 = invoiceArray[index].Custom3 <= 0 ? 0 : invoiceArray[index].Custom3;
    invoiceArray[index].Custom4 = invoiceArray[index].Custom4 <= 0 ? 0 : invoiceArray[index].Custom4;
    invoiceArray[index].Custom5 = invoiceArray[index].Custom5 <= 0 ? 0 : invoiceArray[index].Custom5;
    invoiceArray[index].AdvancePay = invoiceArray[index].AdvancePay <= 0 ? 0 : invoiceArray[index].AdvancePay;
    this.listOfInvoices = invoiceArray;
    if(id != 0){
      this.changedInvoices.push(id);
    }
    else{
      this.NonDataBaseChanged= true;
    }
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
    if(this.changedInvoices.length > 0 || this.NonDataBaseChanged){
      Swal.fire({
        title:'Error',
        text:'Invoices are not saved!',
        icon:'error'
      })
    }
    else{
      let checked:any = this.getCheckedInvoices();
      let SuccessApprove:any = [];
      let ErorApprove:any = [];
      this.listOfInvoices.forEach((invoice:any) => {
        if(checked.findIndex((x:any) => x.SupplierID == invoice.SupplierID) != -1){
          if(this.getNet(invoice) != 0){
            invoice.isApproved = true;
            SuccessApprove.push(invoice);
            this.changedInvoices.push(invoice.id);
          }
          else{
            ErorApprove.push(invoice);
          }
        }
      });
      this.showApproveSweetAlert(SuccessApprove,ErorApprove);
      this.allChecked = false;
      this.allCheckedChanged();
    } 
  }

  showApproveSweetAlert(SuccessApprove:any,ErorApprove:any){
    let errorList = " | ";
    ErorApprove.forEach((invoice:any) => {
      errorList += invoice.SupplierName + " | "
    });
    if(SuccessApprove + ErorApprove != 0){
      if(ErorApprove.length == 0){
        Swal.fire({
          title:'Invoice(s) were approved',
          icon:'success'
        })
      }
      else if(SuccessApprove.length == 0){
        Swal.fire({
          title:'Error',
          text:'Cannot Approve Invoices with net as 0',
          icon:'error'
        })
      }
      else{
        Swal.fire({
          title: SuccessApprove.length + ' Invoice(s) approved | ' + ErorApprove.length + ' Invoice(s) cannot be approved',
          text: 'Cannot Approve Invoices with net as 0',
          icon: 'info',
          footer: 'Invoices with errors :: ' + errorList,
        })
      }
    }
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
    if(this.changedInvoices.length > 0 || this.NonDataBaseChanged){
      Swal.fire({
        title:'Error',
        text:'Invoices are not saved!',
        icon:'error'
      })
    }
    else if(this.getCheckedInvoices().length > 0){
      this.FullPageLoading = true;
      let body:any = [];
      this.getCheckedInvoices().forEach((invoice:any) => {
        if(invoice.id != 0){
          body.push(invoice.id);
        }
      });
  
      if(body.length > 0){
        this.Pdf.getPDF(body)
        .subscribe((data:any) => { this.AfterCombineAPISuccess(data) }, (error) => { this.serverErrorNotification(error) });
      }
      else{
        this.FullPageLoading = false;
      }
    }
  }

  AfterCombineAPISuccess(data:any){
    let fileContent = data.Result;
    var byteArray = this.base64ToArrayBuffer(fileContent);
    const file = new Blob([byteArray], {type:"application/pdf"});
    FileSaver.saveAs(file, "Combined Invoice.pdf");
    this.FullPageLoading = false;
  }

  base64ToArrayBuffer(base64:any):ArrayBuffer {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  sendEmailToSelected(){
    if(this.changedInvoices.length > 0 || this.NonDataBaseChanged){
      Swal.fire({
        title:'Error',
        text:'Invoices are not saved!',
        icon:'error'
      })
    }
    else if(this.getCheckedInvoices().length > 0){
      this.FullPageLoading = true;
      let body:any = [];
      this.getCheckedInvoices().forEach((invoice:any) => {
        if(invoice.id != 0){
          body.push(invoice.id);
        }
      });

      if(body.length > 0){
        this.Email.sendEmail(body)
        .subscribe((data:any) => { this.EmailSuccess(data) }, (error) => { this.serverErrorNotification(error) });
      }else{
        this.FullPageLoading = false;
      }
      
    }
  }

  EmailSuccess(data:any){
    this.FullPageLoading = false;
    Swal.fire({
      icon: 'success',
      title: 'Email Sent',
      showConfirmButton: false,
    })
  }

  serverErrorNotification(DataString:any): void {
    console.log(DataString);
    this.notification.create(
      'error',
      'Error From Server!',
      DataString.message
    );
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

