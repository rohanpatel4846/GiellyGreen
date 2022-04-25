import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ProfileService } from 'src/app/Services/Profile/profile.service';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  menuOpened = false;
  ProfileForm!: FormGroup;
  FullPageLoading = false;
  ProfileID:any = 0;
  
  constructor(private notification: NzNotificationService, public profile: ProfileService, public router:Router,  public SessionManagement: SessionManagementService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ProfileForm = this.fb.group({
      companyName: [null],
      addressLine: [null],
      city: [null],
      zipCode: [null],
      country: [null],
      defaultVat : [null]
    });

    this.UpdateProfileForm();
  }

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

  submitForm(){
    if (this.ProfileForm.valid){
      this.FullPageLoading=true;
      let body = {
        "id": this.ProfileID,
        "CompanyName":this.ProfileForm.value['companyName'],
        "AddressLine": this.ProfileForm.value['addressLine'],
        "City": this.ProfileForm.value['city'],
        "ZipCode": this.ProfileForm.value['zipCode'],
        "Country": this.ProfileForm.value['country'],
        "DefaultVAT": (this.ProfileForm.value['defaultVat'] == "" || this.ProfileForm.value['defaultVat'] == null ? 0 : this.ProfileForm.value['defaultVat']) + ""
      }

      this.profile.postSupplier(body)
      .subscribe((data:any) => {
        this.FullPageLoading=false;
        this.UpdateProfileForm();
      },
      (error) => {
        this.FullPageLoading = false;
        this.serverErrorNotification(error);
      });
    }else {
      Object.values(this.ProfileForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  UpdateProfileForm(){
    this.FullPageLoading = true;
    this.ProfileID = 0;
    this.profile.getLastProfile()
    .subscribe((data:any) => {
      this.FullPageLoading = false;
      console.log(data);
      if(data.Result != null){
        this.ProfileID = data.Result.id;
        let vat:number = 0;
        try{
          vat = data.Result.DefaultVAT;
        }
        catch(ex){}
        this.ProfileForm.patchValue({
          companyName: [data.Result.CompanyName],
          addressLine: [data.Result.AddressLine],
          city: [data.Result.City],
          zipCode: [data.Result.ZipCode],
          country: [data.Result.Country],
          defaultVat : [vat]
        });
      }
    },
    (error) => {
      this.FullPageLoading = false;
      this.serverErrorNotification(error);
    });
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
