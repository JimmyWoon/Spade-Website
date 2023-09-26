import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent   {

  isMenuVisible: boolean = false;
  isOpenMenu: boolean = false;

  classnames = [
    // { 'navLink': true }, 
    // { 'active-link': this.path=="home" }
  ]

  get path(){
    return location.pathname
  }
  isAuthenticated = false;
  user_information:any = null;

  constructor(private renderer:Renderer2,private el:ElementRef){
    if (sessionStorage.getItem('user') !== null){
      this.isAuthenticated = true;
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
  }
  
  // ngAfterViewInit() {
  //   const navToggle = this.el.nativeElement.querySelector('#nav-toggle');
  //   const navMenu = this.el.nativeElement.querySelector('#nav-menu');
  //   const navClose = this.el.nativeElement.querySelector('#nav-close');

  //   if (navToggle) {
  //     this.renderer.listen(navToggle, 'click', () => {
  //       console.log("dasdas");
  //       navMenu.classList.add('show-menu');
  //     });
  //   }
  //   if(navClose) {
  //     this.renderer.listen(navToggle, 'click', () => {
  //       navMenu.classList.remove('show-menu');
  //     });
  //   }

  // }
  hideMenu(){
    this.isMenuVisible = false;
  }
  showMenu(){
    this.isMenuVisible = true;
  }
  linkAction(){
    this.isMenuVisible = false;
    this.isOpenMenu = false;
  }
  subMenu(){
    this.isOpenMenu = !this.isOpenMenu;
  }
}
