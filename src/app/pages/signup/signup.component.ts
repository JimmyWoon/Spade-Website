import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "service/authentication.service"; 
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl("",Validators.required),
    role: new FormControl('',Validators.required),
    password_confirmation: new FormControl("",Validators.required),
    // checkbox: new FormControl(false)
  })
  user_information:any = null;
  spade: AngularFirestoreDocument<any> | undefined;
  msg:string = '';
  email:string|null = null;

  constructor(private router:Router,private route: ActivatedRoute,private authService:AuthService,private firestore: AngularFirestore,private fireAuth: AngularFireAuth) {
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

  ngOnInit(){
    // Retrieve the email parameter from the route
    this.route.queryParams.subscribe(queryParams => {
      const oobCodeFromLink  = queryParams['oobCode'];
      console.log(oobCodeFromLink );
      console.log(queryParams['apiKey']);

      this.fireAuth.applyActionCode(oobCodeFromLink)
        .then(() => {
          // OOB code is valid.
          console.log('OOB code is valid');
          // Proceed with completing the registration.
        })
        .catch((error) => {
          // OOB code verification failed.
          console.log(error);
        });

      // if (oobCodeFromLink ) {
      //   console.log("masuk");
      //   this.authService.applyActionCode(oobCodeFromLink )
      //     .then(() => {
      //       // Verification successful, you can navigate or perform other actions
      //       console.log('Email verification successful');
      //     })
      //     .catch(error => {
      //        // Handle error, log more details
      //         console.log('Error applying email verification code:', error);

      //         // Log the error message
      //         console.log('Error message:', error.message);

      //             // Handle specific error scenarios
      //         if (error.code === 'auth/expired-action-code') {
      //           // The action code has expired. You might want to generate a new code or handle it accordingly.
      //           console.log('auth/expired-action-code:', error.message);

      //         } else if (error.code === 'auth/invalid-action-code') {
      //           // The action code is invalid, could be malformed or already used.
      //           // You might want to show a user-friendly message or take appropriate actions.
      //           console.log('auth/invalid-action-code', error.message);

      //         } else {
      //           // Handle other error scenarios
      //           console.log('error message: ', error.message);

      //         }

      //         // window.location.href='/email-verification';

      //     });
      // } else {
      //   // Handle the case when the oobCode parameter is not present
      //   console.warn('oobCode parameter is missing or invalid.');
      //   this.router.navigate(['/']);
      // }

      // this.email = params['email'];
      // if  (this.email) {
      //   this.confirmEmailVerification();
      // } else {
      //   window.location.href='/';
      // }
    });
  }

  submit() {
    const usernameControl = this.formGroup.get('username');
    const passControl = this.formGroup.get('password');
    const roleControl = this.formGroup.get('role');
    const pass_confirmControl = this.formGroup.get('password_confirmation');

    if (this.formGroup.valid && this.email !== null){
      if (passControl?.value === pass_confirmControl?.value){
        this.fireAuth.signInWithEmailAndPassword(
          "jimmyechunwoon@gmail.com",
          "123456"
        ).then( () => {
          
          this.firestore.collection('user', ref => 
            ref.where('username', '==', usernameControl?.value)
              .where('date_deleted', '==', null)
              .limit(1) // Limit to 1 document, assuming there should be at most one matching document
          ).get().subscribe(querySnapshot => {
            if (!querySnapshot.empty) {
              this.msg=' This username is already registered.'
              this.formGroup.reset;
            } else {
              var newUser = {
                username: usernameControl?.value,
                password: pass_confirmControl?.value,
                role: roleControl?.value,
                email: this.email,
                date_added: new Date(),
                date_upadated: new Date(),
                date_deleted: null
              }
              this.firestore.collection('user').add(newUser).then(() => {
                window.location.href='/login';
              })
              .catch((error) => {
                console.error('Error adding data:', error);
              });
            }
          })
        }); 
      }else{
        this.msg='Password not match.'
        passControl?.setValue('');
        pass_confirmControl?.setValue('');
      }
    }else{
      this.msg='Please enter required information.'
    }
  }

  private compareOobCodes(oobCodeFromLink: string) {
    // Get the user from AngularFireAuth
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        console.log('User UID:', user.uid); // This is the user's UID, not the oobCode

        // You can also get the email address
        console.log('User Email:', user.email);
    
        // Get the action codes associated with the user
        user.getIdTokenResult()
          .then(idTokenResult => {
            // The oobCode should be in idTokenResult.signInProviderData
            const oobCode = idTokenResult.claims['firebase']['sign_in_provider'];
            console.log('Received oobCode from Firebase:', oobCode);
    
            // Now you can proceed with your logic using the oobCode
            this.compareOobCodes(oobCode);
          })
          .catch(error => {
            console.error('Error getting ID token result:', error);
          });
      }
    });
  }
    //   console.log(this.formGroup.getRawValue())
    // // on loding
    //   // db: AngularFireStore
    //   let d = this.firestore.collection('spade')
    //     .doc('ZQZEZNlEWX9cGm6oSGaW')
    //     .get()
    //     .subscribe({
    //       next: (data) => {
    //         // off loading
    //         console.log("next", data.data());
    //       },
    //       error: (error) => console.error("error", error),
    //       complete: () => {console.log("complete");
    //     setTimeout(() =>{d.unsubscribe()},3000)}
    //     }
    //     );

    //   this.firestore.collection("spade").add({
    //     name: "jimmy",
    //     type: "school"
    //   })

    // this.firestore.collection('spade').get().subscribe
    //   ({
    //     next: (data) => { console.log("next", data.size);

    //    },
    //     error: (error) => console.error("error", error),
    //     complete: () => console.log("complete")
    //   });

    // let data = this.spade.ref.id
    // console.log(data)

    // this.spade.ref().get().subscribe((data)=> {
    //   console.log(data)
    // })

  // confirmEmailVerification() {
  //   // Use Firebase Authentication to confirm the email verification
  //   this.authService.applyActionCode(this.email!)
  //     .then(() => {
  //       // Email link activated successfully
  //       console.log('Email verification successful for email:', this.email);
  //       // Now you can redirect the user to a success page or perform other actions
  //       this.router.navigate(['/signup-success']);
  //     })
  //     .catch((error) => {
  //       // Handle the error, for example, show an error message
  //       console.error('Error applying email action code', error);
  //       // Redirect to an error page or handle it as needed
  //       this.router.navigate(['/email-verification']);
  //     }
  //   );
  // }
}
