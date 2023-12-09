import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "service/authentication.service"; 
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent  {

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl("",Validators.required),
    email: new FormControl("",Validators.required),

    //role: new FormControl('',Validators.required),
    password_confirmation: new FormControl("",Validators.required),
    // checkbox: new FormControl(false)
  })
  user_information:any = null;
  spade: AngularFirestoreDocument<any> | undefined;
  msg:string = '';

  constructor(private cookieService: CookieService,private router:Router,private route: ActivatedRoute,private authService:AuthService,private firestore: AngularFirestore,private fireAuth: AngularFireAuth) {
    // if (sessionStorage.getItem('user') !== null) {
    //   const sessionData = JSON.parse(sessionStorage.getItem('user')!);
    //   this.user_information = sessionData;
    // }

    // if (sessionStorage.getItem('email') !== null){
    //   var sessionData2 = JSON.parse(sessionStorage.getItem('email')!);
    //   this.email = sessionData2.email;
    // }else{
    //   window.location.href='/email-verification';
    // }

    
    // this.formGroup.valueChanges.subscribe((changes) => {
    //   // console.log(changes)
    // })
  }

  // ngOnInit(){
  //   // Retrieve the email parameter from the route
  //   this.route.queryParams.subscribe(queryParams => {
  //     const oobCodeFromLink  = queryParams['oobCode'];
  //     console.log(oobCodeFromLink );
  //     console.log(queryParams['apiKey']);

  //     this.fireAuth.applyActionCode(oobCodeFromLink)
  //       .then(() => {
  //         // OOB code is valid.
  //         console.log('OOB code is valid');
  //         // Proceed with completing the registration.
  //       })
  //       .catch((error) => {
  //         // OOB code verification failed.
  //         console.log(error);
  //       });

  //     // if (oobCodeFromLink ) {
  //     //   console.log("masuk");
  //     //   this.authService.applyActionCode(oobCodeFromLink )
  //     //     .then(() => {
  //     //       // Verification successful, you can navigate or perform other actions
  //     //       console.log('Email verification successful');
  //     //     })
  //     //     .catch(error => {
  //     //        // Handle error, log more details
  //     //         console.log('Error applying email verification code:', error);

  //     //         // Log the error message
  //     //         console.log('Error message:', error.message);

  //     //             // Handle specific error scenarios
  //     //         if (error.code === 'auth/expired-action-code') {
  //     //           // The action code has expired. You might want to generate a new code or handle it accordingly.
  //     //           console.log('auth/expired-action-code:', error.message);

  //     //         } else if (error.code === 'auth/invalid-action-code') {
  //     //           // The action code is invalid, could be malformed or already used.
  //     //           // You might want to show a user-friendly message or take appropriate actions.
  //     //           console.log('auth/invalid-action-code', error.message);

  //     //         } else {
  //     //           // Handle other error scenarios
  //     //           console.log('error message: ', error.message);

  //     //         }

  //     //         // window.location.href='/email-verification';

  //     //     });
  //     // } else {
  //     //   // Handle the case when the oobCode parameter is not present
  //     //   console.warn('oobCode parameter is missing or invalid.');
  //     //   this.router.navigate(['/']);
  //     // }

  //     // this.email = params['email'];
  //     // if  (this.email) {
  //     //   this.confirmEmailVerification();
  //     // } else {
  //     //   window.location.href='/';
  //     // }
  //   });
  // }

  async isEmailRegistered(email: string): Promise<boolean> {
    try {
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, 'someDummyPassword');
      const user = userCredential.user;

      // If the email is not already registered, the account will be created successfully
      // Now, you may want to delete the created user, or you can keep it if not causing issues
      if (user) {
        await user.delete();
      }
      return false;

    } catch (error:any) {
      if (error.code === 'auth/email-already-in-use') {
        // The email is already registered
        return true;
      } else {
        // Handle other errors
        console.error('Error checking email registration:', error);
        return false;
      }
    }
  }



  submit() {
    const usernameControl = this.formGroup.get('username');
    const emailControl = this.formGroup.get('email');

    const passControl = this.formGroup.get('password');
    //const roleControl = this.formGroup.get('role');
    const pass_confirmControl = this.formGroup.get('password_confirmation');

    if (this.formGroup.valid ){
      if (this.formGroup.valid && usernameControl?.value !== null && emailControl?.value !== null){
        if (passControl?.value.length >= 6) {
          this.msg='';

          if (passControl?.value === pass_confirmControl?.value){

            this.isEmailRegistered(emailControl?.value).then((isRegistered) => {
              if (isRegistered) {
                this.msg = `The email ${emailControl?.value} is already registered.`;
              }else{
                this.msg = '';
                this.cookieService.set('newuser-email', emailControl?.value, 0.5);  
                this.cookieService.set('newuser-password', passControl?.value, 0.5);  
                this.cookieService.set('newuser-username', usernameControl?.value, 0.5);  

                // Register the user with Firebase Authentication
                this.fireAuth.createUserWithEmailAndPassword(emailControl?.value, passControl?.value)
                .then((userCredential) => {
                  // Send email verification
                  userCredential.user?.sendEmailVerification();
                  })
                .then(() => {
                  // Email verification sent!  
                  this.msg = 'Email verification sent!';
                  this.fireAuth.signInWithEmailAndPassword(emailControl?.value, passControl?.value).then((userCredential) => {
                    // User has successfully signed in
                    const user = userCredential.user;
                    this.cookieService.set('newuser-uid', user?.uid! , 0.5);  
                  });


                })
                .catch((error) => {
                  // User creation failed
                  this.msg =error;
                  // Handle the error accordingly
                });
              }
            });
            // this.fireAuth.signInWithEmailAndPassword(
            //   "jimmyechunwoon@gmail.com",
            //   "123456"
            // ).then( () => {
              
            //   this.firestore.collection('user', ref => 
            //     ref.where('username', '==', usernameControl?.value)
            //       .where('date_deleted', '==', null)
            //       .limit(1) // Limit to 1 document, assuming there should be at most one matching document
            //   ).get().subscribe(querySnapshot => {
            //     if (!querySnapshot.empty) {
            //       this.msg=' This username is already registered.'
            //       this.formGroup.reset;
            //     } else {
            //       var newUser = {
            //         username: usernameControl?.value,
            //         password: pass_confirmControl?.value,
            //         role: roleControl?.value,
            //         email: this.email,
            //         date_added: new Date(),
            //         date_upadated: new Date(),
            //         date_deleted: null
            //       }
            //       this.firestore.collection('user').add(newUser).then(() => {
            //         window.location.href='/login';
            //       })
            //       .catch((error) => {
            //         console.error('Error adding data:', error);
            //       });
            //     }
  
  
          }else{
            this.msg='Password not match.'
            passControl?.setValue('');
            pass_confirmControl?.setValue('');
          }
        }else{
          this.msg='Password must be at least 6 characters long.';
          passControl?.setValue('');
          pass_confirmControl?.setValue('');
        }
      }else{
        this.msg='Please enter required information.'
      }
    }
    else{
      this.msg='Please enter required information.'
    }
  }
}
