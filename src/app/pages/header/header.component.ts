import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMenuVisible: boolean = false;
  isOpenMenu: boolean = false;

  classnames = [
    // { 'navLink': true },
    // { 'active-link': this.path=="home" }
  ];

  get path() {
    return location.pathname;
  }
  isAuthenticated = false;
  user_information: any = null;

  constructor() {
    if (sessionStorage.getItem('user') !== null) {
      this.isAuthenticated = true;
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
  }

  hideMenu() {
    this.isMenuVisible = false;
  }
  showMenu() {
    this.isMenuVisible = true;
  }
  linkAction() {
    this.isMenuVisible = false;
    this.isOpenMenu = false;
  }
  subMenu() {
    this.isOpenMenu = !this.isOpenMenu;
  }
}
