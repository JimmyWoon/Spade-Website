import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  formGroup: FormGroup = new FormGroup({
    pass: new FormControl('',Validators.required),
    pass_confirm: new FormControl("",Validators.required)

  })
  msg:string = '';
  reset_email:string|null = null;
  static otp:string = '';

  oobCode:string |null = null;


  constructor(private cookieService: CookieService,private fireAuth:AngularFireAuth,private firestore: AngularFirestore){

    
    if (this.cookieService.get('reset-email') && this.cookieService.get('oobCode')) {
      this.reset_email = this.cookieService.get('reset-email') || '';
      this.cookieService.delete('reset-email');

      this.oobCode = this.cookieService.get('oobCode') || '';
      this.cookieService.delete('oobCode');
    }else{
      window.location.href='/forgot-password';
    }

  }



  submit(){
    if (this.formGroup.valid){
      const passControl = this.formGroup.get('pass');
      const pass_confirmControl = this.formGroup.get('pass_confirm');
      if(pass_confirmControl?.value === passControl?.value){
        if (passControl?.value.length >= 6) {
          this.msg='';

          this.fireAuth.confirmPasswordReset(this.oobCode!,passControl?.value).then(() => {
            this.fireAuth.signInWithEmailAndPassword(
              this.reset_email!,
              passControl?.value
            ).then((userCredential)=>{
              const uid = userCredential.user?.uid;

              // console.log(uid);
              this.firestore
              .collection('user').ref
              .where('uid', '==', uid).where("date_deleted","==", null)
              .get()
              .then((querySnapshot) =>{
                if (!querySnapshot.empty){
                  const userDocument = querySnapshot.docs[0];
            
                  querySnapshot.forEach((doc)=>{
                    this.firestore.collection('user').doc(doc.id).update({
                      'password': passControl?.value,
                      'date_updated': new Date()
                    }).then(() => {
                      sessionStorage.setItem('msg', JSON.stringify('Password reset successfully!'));
                      window.location.href='/login';
                    });
                  })
                 
                }else{
                  this.msg= "No user found.";
                }
              })
              .catch((error) =>{
                this.msg= "No user found.";
              });
              });
            });

        }else{
          this.msg='Password must be at least 6 characters long.';
          passControl?.setValue('');
          pass_confirmControl?.setValue('');
        }
      }else{
        this.msg='Password not match.';
        passControl?.setValue('');
        pass_confirmControl?.setValue('');
      }
        


        // this.fireAuth.signInWithEmailAndPassword(
        //   "jimmyechunwoon@gmail.com",
        //   "123456"
        // ).then(async () => { 
        //   try {
        //     const collectionRef = this.firestore.collection('user')
        //     const query = collectionRef.ref.where('email', '==', this.email);
        //     query
        //     .get()
        //     .then((querySnapshot) => {
        //       // Check if any documents match the query
        //       if (!querySnapshot.empty) {
        //         // Iterate through the results (there should be only one in this case)
        //         querySnapshot.forEach((doc) => {
        //           // Get the document reference and update the fields you need
        //           const docRef = collectionRef.doc(doc.id);
        //           docRef.update({
        //             // Update other fields here
        //             password: pass_confirmControl?.value,
        //             date_updated: new Date(),
        //           });
        //         });
        //         window.location.href='/login';

        //       } else {
        //         console.log('No document with the specified email found.');
        //       }
        //     })
        //     .catch((error) => {
        //       console.error('Error updating document: ', error);
        //     });
        //   } catch (error) {
        //     console.error('Error updating document:', error);
        //   } 
        // });
        // window.location.href = '/forgot-password'; 
        
  

    }else{
      this.msg='Please enter information.';
    }
  }
}
