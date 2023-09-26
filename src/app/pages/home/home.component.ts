import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  label = "Home page";
  isAuthenticated = false;

  constructor(){
    if (sessionStorage.getItem('user') !== null){
      // this.isAuthenticated = true;
      // const jsonString = sessionStorage.getItem('user');
      // const myObject = jsonString ? JSON.parse(jsonString) : null;
      // console.log(myObject);
    }
  }

  
  click() {
   console.log("clicked")
  }


}
