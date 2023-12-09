import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'service/user';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { user } from 'firebase-functions/v1/auth';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  msg: String = '';
  formGroup: FormGroup;
  passwordHidden: boolean = true;
  urlParams = new URLSearchParams(window.location.search);
  mode = this.urlParams.get('mode');
  oobCode = this.urlParams.get('oobCode');
  forgot_password = this.urlParams.get('type');

  email : string  = '';
  password : string  = '';
  username : string = '';
  uid : string = '';


  constructor(private cookieService: CookieService,private router: Router, private formBuilder: FormBuilder,private firestore: AngularFirestore, private fireAuth: AngularFireAuth, private userService: UserService) {
    
    if (sessionStorage.getItem('msg') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('msg')!);
      this.msg = sessionData;
    }
    
    if (this.forgot_password && this.forgot_password == '1'){
      this.cookieService.set('oobCode', this.oobCode!, 0.5);  
      window.location.href='/reset-password';
    }
    
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.mode === 'verifyEmail') {
      if (this.oobCode !== null){
        this.fireAuth.applyActionCode(this.oobCode)
        .then(() => {
          this.email =    this.cookieService.get('newuser-email') || '';
          this.password =    this.cookieService.get('newuser-password') || '';
          this.username =    this.cookieService.get('newuser-username') || '';
          this.uid =    this.cookieService.get('newuser-uid') || '';

          this.cookieService.delete('newuser-email');
          this.cookieService.delete('newuser-password');
          this.cookieService.delete('newuser-username');
          this.cookieService.delete('newuser-uid');

          if (this.username !==  '' || this.email !== '' || this.password !== '' || this.uid !== ''){
            // Email verified successfully.

            var newUser = {
              username: this.username,
              password: this.password,
              role: 'Student',
              email: this.email,
              date_added: new Date(),
              date_upadated: new Date(),
              date_deleted: null,
              uid: this.uid
            }

            this.firestore.collection('user').add(newUser).then(() => {
              window.location.href='/login';
            })
            .catch((error) => {
              console.error('Error adding data:', error);
            })
          } else{
            //empty username OR email OR password
            window.location.href='/login';
          }                
        })
        .catch((error) => {
            // Handle errors.
            this.msg='Verify failed.'
          });
      }
    }
  }


  ngOnInit() {
  }

  // firestore.collection('user').
  showPassword() {
    this.passwordHidden = !this.passwordHidden;
  }
  submit() {
    const emailControl = this.formGroup.get('email');
    const passwordControl = this.formGroup.get('password');

    if (emailControl && passwordControl && this.formGroup.valid) {
      // this.fireAuth.signInWithEmailAndPassword(
      //   "jimmyechunwoon@gmail.com",
      //   "123456"
      // ).then((success) => {
      //   this.userService
      //     .checkUserCredentials(emailControl.value, passwordControl.value)
      //     .then((userData) => {
      //       if (userData !== null) {
      //         if (typeof userData !== 'string') {
      //           this.formGroup.reset();
      //           sessionStorage.setItem('user', JSON.stringify(userData[0]));
      //           window.location.href='/';

      //         } else {
      //           this.msg = userData;
      //           this.formGroup.reset();
      //         }
      //       } else {
      //         this.msg = "Wrong email or password";
      //         this.formGroup.reset();
      //       }
      //     })
      //     .catch((error) => {
      //       console.error("Error: ", error);
      //       this.formGroup.reset();
      //     })
      // })
      const email = emailControl.value;
      const password = passwordControl.value;
      
      this.fireAuth.signInWithEmailAndPassword(email, password)

        .then((userCredential) => {
          // Login successful, if email verified, navigate to the home page
          if( userCredential.user?.emailVerified ){
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
              });
          } else {
            alert('Email not verified yet.')
          }
        })
        .catch((error) => {
          // Handle login error
          this.msg = "Wrong email or password";
          console.error(error);
        });
    } else {
      this.msg = "Please enter valid information";
      this.formGroup.reset();
    }
  }

}
