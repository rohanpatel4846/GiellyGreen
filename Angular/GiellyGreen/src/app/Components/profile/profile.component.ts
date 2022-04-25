import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  
  constructor(public router:Router,  public SessionManagement: SessionManagementService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.ProfileForm = this.fb.group({
      companyName: [null],
      addressLine: [null],
      city: [null],
      zipCode: [null],
      country: [null],
      defaultVat : [null]
    });
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
    
  }
}
