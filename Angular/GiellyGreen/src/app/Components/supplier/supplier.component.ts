import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/Services/Image/image.service';
import { ImageUploaderService } from 'src/app/Services/ImageUploader/image-uploader.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import { SuppliersService } from 'src/app/Services/Suppliers/suppliers.service';
import Swal from 'sweetalert2';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ValidationService } from 'src/app/Services/Validations/validation.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit {

  menuOpened = false;
  isVisibleSupplierModal = false;
  SupplierModalTitle = "Add New Supplier"
  SupplierForm!: FormGroup;
  supplierTableLoading = false;
  isImageSelected = false;
  UploadedImage:any;
  UploadedImgInBase64:any;
  SelectedImgType:any;
  searchTextBox:any;
  
  supplierRefUnique:any = true;
  supplierEmailUnique:any = true;
  supplierVatUnique:any = true;
  supplierTaxUnique:any = true;

  @ViewChild('logoFile') logoFile:any;

  listOfColumn = [
    {
      title: 'Supplier Reference',
      compare: (a: SupplierTable, b: SupplierTable) => a.SupplierReferenceNumber.localeCompare(b.SupplierReferenceNumber),
      priority: 1
    },
    {
      title: 'Supplier Name',
      compare: (a: SupplierTable, b: SupplierTable) => a.SupplierName.localeCompare(b.SupplierName),
      priority: 2
    }
  ];

  listOfData: SupplierTable[] = [];
  listOfDataBackup: SupplierTable[] = []; 

  SearchChanged(){
    this.listOfData = this.listOfDataBackup;
    let validData:any = [];
    this.listOfData.forEach(data => {
      if((data.SupplierName).toUpperCase().includes((this.searchTextBox).toUpperCase())){
        validData.push(data);
      }
    });
    this.listOfData = validData;
  }

  constructor(private Validation:ValidationService, private notification: NzNotificationService, public router:Router, private fb: FormBuilder, public Suppliers: SuppliersService, public ImageUploader: ImageUploaderService, public Image: ImageService, public SessionManagement: SessionManagementService) { }

  ngOnInit(): void {
    this.SessionManagement.updateIsLoggedIn();
    if(!SessionManagementService.isLoggedIn){
      this.router.navigate(['login']);
    }

    this.SupplierForm = this.fb.group({
      supplierName: [null, [Validators.required, Validators.pattern(/^[A-Z]+$/i)]],
      supplierReference: [null, [Validators.required, Validators.pattern(/^([a-zA-Z0-9_-]){0,15}$/)]],
      businessAddress: [null, [Validators.pattern(/^.{0,150}$/)]],
      emailAddress: [null, [Validators.email,Validators.required]],
      phoneNumber: [null, [Validators.pattern(/^[0-9]{0,15}$/)]],
      CompanyRegisterNumber: [null, [Validators.pattern(/^[0-9]{0,15}$/)]],
      vatNumber: [null, [Validators.pattern(/^([a-zA-Z0-9_-]){0,15}$/)]],
      taxReference: [null, [Validators.pattern(/^([a-zA-Z0-9_-]){0,15}$/)]],
      CompanyRegisteredAddress: [null, [Validators.pattern(/^.{0,150}$/)]],
      isActive: [false],
      id: 0
    });

    this.UpdateSupplierTable();
  }

  RemoveImage(){
    this.isImageSelected = false;
    this.UploadedImgInBase64 = null;
    this.SelectedImgType = null;
    this.logoFile.nativeElement.value = "";
  }

  resetForm(){
    this.SupplierModalTitle = "Add New Supplier";
    this.SupplierForm.patchValue({
      supplierName: null,
      supplierReference: null,
      businessAddress: null,
      emailAddress: null,
      phoneNumber: null,
      CompanyRegisterNumber: null,
      vatNumber: null,
      taxReference: null,
      CompanyRegisteredAddress: null,
      isActive: false,
      id: 0
    })
    this.SupplierForm.reset();
    this.isImageSelected = false;
    this.UploadedImgInBase64 = null;
    this.SelectedImgType = null;
    this.logoFile.nativeElement.value = "";

    this.supplierRefUnique = true;
    this.supplierEmailUnique = true;
    this.supplierVatUnique = true;
    this.supplierTaxUnique = true;
  }

  UpdateSupplierTable(){
    this.supplierTableLoading = true;
    this.Suppliers.getAllSupplier()
      .subscribe((data:any) => {
        let result = data.Result;
        let tableData: SupplierTable[] = [];
        try{
          result.forEach((supplier:any) => {
            let supplierOBJ:SupplierTable = {
              BusinessAddress: supplier.BusinessAddress,
              CompanyRegisterNumber: supplier.CompanyRegisterNumber,
              CompanyRegisteredAddress: supplier.CompanyRegisteredAddress,
              EmailAddress: supplier.EmailAddress,
              ImageId: supplier.ImageId,
              PhoneNumber: supplier.PhoneNumber,
              SupplierName: supplier.SupplierName,
              SupplierReferenceNumber: supplier.SupplierReferenceNumber,
              TAXReference: supplier.TAXReference,
              VATNumber: supplier.VATNumber,
              id: supplier.id,
              isActive: supplier.isActive
            };
            tableData.push(supplierOBJ);
          });
          this.listOfData = tableData;
          this.listOfDataBackup=tableData;
          this.supplierTableLoading = false;
        }
        catch(ex){
          console.log(ex);
          this.supplierTableLoading = false;
        }
        
      }, (error) => { this.serverErrorNotification(error) });
  }

  showModalSupplier(){
    this.isVisibleSupplierModal = true;
  }

  handleCancelSupplierModal(){
    this.resetForm();
    this.isVisibleSupplierModal = false;
  }

  submitForm(): void {
    if (this.SupplierForm.valid) {

      if(this.isImageSelected){
        let ImageOBJ = {
          "Image64STR": this.UploadedImgInBase64,
          "ImageType": this.SelectedImgType
        }

        this.supplierTableLoading = true;
        this.ImageUploader.postImage(ImageOBJ)
          .subscribe((data:any) => {
            this.supplierTableLoading = false;
            let body = {
              "url":data.Result
            }

            this.supplierTableLoading = true;
            this.Image.postImage(body)
              .subscribe((data:any) => {
                this.saveForm(data.Result);
                this.supplierTableLoading = false;
              },
              (error) => {
                this.supplierTableLoading = false;
                this.serverErrorNotification(error);
              });
          },
          (error) => {
            this.supplierTableLoading = false;
            this.serverErrorNotification(error);
          });
      }
      else{
        this.saveForm(1);
      }
      

      
    } else {
      Object.values(this.SupplierForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  saveForm(imageID:any){
    let SupplierTableOBJ = {
      BusinessAddress: this.SupplierForm.value['businessAddress'],
      CompanyRegisterNumber: this.SupplierForm.value['CompanyRegisterNumber'],
      CompanyRegisteredAddress: this.SupplierForm.value['CompanyRegisteredAddress'],
      EmailAddress: this.SupplierForm.value['emailAddress'],
      ImageId: imageID,
      PhoneNumber: this.SupplierForm.value['phoneNumber'],
      SupplierName: this.SupplierForm.value['supplierName'],
      SupplierReferenceNumber: this.SupplierForm.value['supplierReference'],
      TAXReference: this.SupplierForm.value['taxReference'],
      VATNumber: this.SupplierForm.value['vatNumber'],
      id: this.SupplierForm.value['id'],
      isActive: this.SupplierForm.value['isActive'],
    }

    if(SupplierTableOBJ.id == 0){
      this.supplierTableLoading = true;
      this.handleCancelSupplierModal();
      this.Suppliers.postSupplier(SupplierTableOBJ)
        .subscribe((data:any) => {
          this.supplierTableLoading = false;
          this.UpdateSupplierTable();
        }, (error) => { this.serverErrorNotification(error) });
    }
    else{
      this.supplierTableLoading = true;
      this.handleCancelSupplierModal();
      this.Suppliers.putSupplier(SupplierTableOBJ)
        .subscribe((data:any) => {
          this.supplierTableLoading = false;
          this.UpdateSupplierTable();
        }, (error) => { this.serverErrorNotification(error) });
    }

    this.resetForm();
  }

  SwitchChanged(row:any){
    this.supplierTableLoading = true;
    this.Suppliers.patchIsActive(row.id, row.isActive, row)
      .subscribe((data:any) => {
        this.supplierTableLoading = false;
      }, (error) => { this.serverErrorNotification(error) });
  }

  EditClicked(data:any){
    this.SupplierModalTitle = "Edit Supplier";
    
    this.SupplierForm.patchValue({
      supplierName: data.SupplierName,
      supplierReference: data.SupplierReferenceNumber,
      businessAddress: data.BusinessAddress,
      emailAddress: data.EmailAddress,
      phoneNumber: data.PhoneNumber,
      CompanyRegisterNumber: data.CompanyRegisterNumber,
      vatNumber: data.VATNumber,
      taxReference: data.TAXReference,
      CompanyRegisteredAddress: data.CompanyRegisteredAddress,
      isActive: data.isActive,
      id: data.id
    })

    this.Image.getImage(data.ImageId)
      .subscribe((data:any) => {
        if(data.Result[0].id != 1){
          let url = data.Result[0].url;
          this.ImageUploader.getImage(url)
          .subscribe((data:any) => {
            this.isImageSelected = true;
            this.UploadedImage = "data:image/png;base64," + data.Result;
            this.UploadedImgInBase64 = data.Result;
          })
        }
      }, (error) => { this.serverErrorNotification(error) });

    this.showModalSupplier();
  }

  EmailChanged(event:any){
    this.Validation.validatedEmail(event.target.value)
        .subscribe((data:any) => {
          console.log(data);
          if(data.Result == 1){
            this.supplierEmailUnique = false;
          }
          else{
            this.supplierEmailUnique = true;
          }
        }, (error) => { this.serverErrorNotification(error) });
  }

  DeleteClicked(row:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "Once the record is deleted, this process cannot be undone.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.supplierTableLoading = true;
        this.Suppliers.deleteSupplier(row.id)
          .subscribe((data:any) => {
            this.supplierTableLoading = false;
            if(data.Result == 0){
              Swal.fire({
                title: 'Supplier Not Deleted',
                text: "Error in Deleting this Supplier!",
                icon: 'error',
              });
            }
            else if(data.Result == -1){
              Swal.fire({
                title: 'Supplier Not Deleted',
                text: "Supplier cannot be deleted as supplier record exist in invoices",
                icon: 'error',
              });
            }
            else{
              Swal.fire('Supplier Deleted', '', 'success');
            }
            this.UpdateSupplierTable();
          }, (error) => { this.serverErrorNotification(error) });
      }
    })
  }

  uploadedFileChanged(event:any){
    var files = event.target.files;
    var file = files[0];
  
    let type = file.type;
    let size = file.size;
    
    this.SelectedImgType = type.replace("image/", ".");;

    if(type == "image/png" || type == "image/jpeg"){
      if(files && file){
        this.isImageSelected = true;
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.UploadedImage = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }

      if (files && file) {
        var reader = new FileReader();
        reader.onload = (event:any) => {
          var binaryString = event.target.result;
          this.UploadedImgInBase64 = btoa(binaryString);
        }
        reader.readAsBinaryString(file);
      }
    }
    else{
      Swal.fire({
        title: 'Image cannot Be uploaded',
        text: "Only PNG and JPEG Images Are Allowed",
        icon: 'error',
      });
    }
    
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

interface SupplierTable {
  BusinessAddress: string
  CompanyRegisterNumber: number
  CompanyRegisteredAddress: string
  EmailAddress: string
  ImageId: number
  PhoneNumber: number
  SupplierName: string
  SupplierReferenceNumber: string
  TAXReference: string
  VATNumber: number
  id: number
  isActive: boolean
}
