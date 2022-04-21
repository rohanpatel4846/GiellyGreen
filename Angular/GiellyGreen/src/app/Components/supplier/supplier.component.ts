import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/Services/Image/image.service';
import { ImageUploaderService } from 'src/app/Services/ImageUploader/image-uploader.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import { SuppliersService } from 'src/app/Services/Suppliers/suppliers.service';
import Swal from 'sweetalert2';

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

  constructor(public router:Router, private fb: FormBuilder, public Suppliers: SuppliersService, public ImageUploader: ImageUploaderService, public Image: ImageService, public SessionManagement: SessionManagementService) { }

  ngOnInit(): void {
    this.SessionManagement.updateIsLoggedIn();
    if(!SessionManagementService.isLoggedIn){
      this.router.navigate(['login']);
    }

    this.SupplierForm = this.fb.group({
      supplierName: [null, [Validators.required]],
      supplierReference: [null, [Validators.required]],
      businessAddress: [null],
      emailAddress: [null, [Validators.email,Validators.required]],
      phoneNumber: [null],
      companyRegisteedNumber: [null],
      vatNumber: [null],
      taxReference: [null],
      companyRegisteredAddress: [null],
      isActive: [false],
      id: 0
    });

    this.UpdateSupplierTable();
  }

  resetForm(){
    this.SupplierForm.patchValue({
      supplierName: null,
      supplierReference: null,
      businessAddress: null,
      emailAddress: null,
      phoneNumber: null,
      companyRegisteedNumber: null,
      vatNumber: null,
      taxReference: null,
      companyRegisteredAddress: null,
      isActive: false,
      id: 0
    })
    this.isImageSelected = false;
    this.UploadedImgInBase64 = null;
    this.SelectedImgType = null;
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
              CompanyRegisterNumber: supplier.companyRegisteedNumber,
              CompanyRegisteredAddress: supplier.companyRegisteedNumber,
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
          this.supplierTableLoading = false;
        }
        catch(ex){
          console.log(ex);
          this.supplierTableLoading = false;
        }
        
      });
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
                console.log(error);
              });
          },
          (error) => {
            this.supplierTableLoading = false;
            console.log(error);
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
      CompanyRegisterNumber: this.SupplierForm.value['companyRegisteedNumber'],
      CompanyRegisteredAddress: this.SupplierForm.value['companyRegisteredAddress'],
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
        });
    }
    else{
      this.supplierTableLoading = true;
      this.handleCancelSupplierModal();
      this.Suppliers.putSupplier(SupplierTableOBJ)
        .subscribe((data:any) => {
          console.log(data);
          this.supplierTableLoading = false;
          this.UpdateSupplierTable();
        });
    }

    this.resetForm();
  }

  SwitchChanged(row:any){
    this.supplierTableLoading = true;
    this.Suppliers.patchIsActive(row.id, row.isActive, row)
      .subscribe((data:any) => {
        this.supplierTableLoading = false;
      });
  }

  EditClicked(data:any){
    this.SupplierForm.patchValue({
      supplierName: data.SupplierName,
      supplierReference: data.SupplierReferenceNumber,
      businessAddress: data.BusinessAddress,
      emailAddress: data.EmailAddress,
      phoneNumber: data.PhoneNumber,
      companyRegisteedNumber: data.CompanyRegisterNumber,
      vatNumber: data.VATNumber,
      taxReference: data.TAXReference,
      companyRegisteredAddress: data.CompanyRegisteredAddress,
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
      });

    this.showModalSupplier();
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
            console.log(data);
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
          });
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