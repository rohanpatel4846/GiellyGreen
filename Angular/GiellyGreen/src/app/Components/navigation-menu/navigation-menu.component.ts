import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManagementService } from 'src/app/Services/SessionManagement/session-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.css']
})
export class NavigationMenuComponent implements OnInit {

  constructor(public router:Router,public SessionManagement: SessionManagementService) { }

  ngOnInit(): void {
  }

  menuOpened = false;

  logOut(){
    Swal.fire({
      title: 'Logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#C99D4A',
      cancelButtonColor: 'grey',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.SessionManagement.deleteCurrentuser();
        this.router.navigate(['login']);
      }
    })
  }
}
