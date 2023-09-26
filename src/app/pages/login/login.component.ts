import { Component, OnInit } from '@angular/core';
import { AngularFirestore, validateEventsArray } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from 'service/user';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  msg : String = '';
  formGroup: FormGroup;
  email : String = '';
  passwordHidden: boolean = true;


  constructor(private router: Router, private formBuilder: FormBuilder, private userService:UserService, private firesotre:AngularFirestore){
    this.formGroup = this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]],
      password: ['',Validators.required]
    })
  }

  // firestore.collection('user').
  showPassword(){
    this.passwordHidden = !this.passwordHidden;
  }
  submit(){
    const emailControl = this.formGroup.get('email');
    const passwordControl = this.formGroup.get('password');

    if (emailControl && passwordControl && this.formGroup.valid) {
      this.userService
      .checkUserCredentials(emailControl.value,passwordControl.value)
      .then((userData) =>{
        if (userData !== null){
          if(typeof userData !== 'string'){
            this.formGroup.reset();
            sessionStorage.setItem('user', JSON.stringify(userData[0]));
  
            this.router.navigate(['/']).then(() => {
              // After navigation, trigger a page refresh
              location.reload();
            });
          }else{
            this.msg = userData;
            this.formGroup.reset();
          }          
        }else{
          this.msg = "Wrong email or password";
          this.formGroup.reset();
        }
      })
      .catch((error)=>{
        console.error("Error: ", error);
        this.formGroup.reset();
      })
    }else{
      this.msg = "Please enter valid information";
      this.formGroup.reset();
    }
  }

  getUser(){
    // const userCollection = collection(this.firesotre)
  }

}
