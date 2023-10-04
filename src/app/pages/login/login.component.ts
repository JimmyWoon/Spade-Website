import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'service/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  msg: String = '';
  formGroup: FormGroup;
  email: String = '';
  passwordHidden: boolean = true;


  constructor(private router: Router, private formBuilder: FormBuilder, private fireAuth: AngularFireAuth, private userService: UserService) {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  // firestore.collection('user').
  showPassword() {
    this.passwordHidden = !this.passwordHidden;
  }
  submit() {
    const emailControl = this.formGroup.get('email');
    const passwordControl = this.formGroup.get('password');

    if (emailControl && passwordControl && this.formGroup.valid) {
      this.fireAuth.signInWithEmailAndPassword(
        "jimmyechunwoon@gmail.com",
        "123456"
      ).then((success) => {
        this.userService
          .checkUserCredentials(emailControl.value, passwordControl.value)
          .then((userData) => {
            if (userData !== null) {
              if (typeof userData !== 'string') {
                this.formGroup.reset();
                sessionStorage.setItem('user', JSON.stringify(userData[0]));
                window.location.href='/';

              } else {
                this.msg = userData;
                this.formGroup.reset();
              }
            } else {
              this.msg = "Wrong email or password";
              this.formGroup.reset();
            }
          })
          .catch((error) => {
            console.error("Error: ", error);
            this.formGroup.reset();
          })
      })

    } else {
      this.msg = "Please enter valid information";
      this.formGroup.reset();
    }
  }

}
