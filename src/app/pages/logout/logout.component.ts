import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router){
    sessionStorage.clear();
    localStorage.clear();
    setTimeout(() => {
      this.router.navigate(['/login']).then(() => {
        // After navigation, trigger a page refresh
        location.reload();
      });
    }, 1000);

  }
}
