import { Component } from '@angular/core';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(){
    sessionStorage.clear();
    localStorage.clear();
    window.location.href='/login';
  }
}
