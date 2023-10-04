import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  email:string|null = null;
  static otp:string = '';

  constructor(private fireAuth:AngularFireAuth,private firestore: AngularFirestore){
    if (sessionStorage.getItem('email') !== null){
      var sessionData2 = JSON.parse(sessionStorage.getItem('email')!);
      this.email = sessionData2.email;
      console.log(this.email);
    }else{
      window.location.href='/forgot-password';
    }
  }
  submit(){
    if (this.formGroup.valid){
      const passControl = this.formGroup.get('pass');
      const pass_confirmControl = this.formGroup.get('pass_confirm');
      if(pass_confirmControl?.value === passControl?.value){
        this.fireAuth.signInWithEmailAndPassword(
          "jimmyechunwoon@gmail.com",
          "123456"
        ).then(async () => { 
          try {
            const collectionRef = this.firestore.collection('user')
            const query = collectionRef.ref.where('email', '==', this.email);

            query
            .get()
            .then((querySnapshot) => {
              // Check if any documents match the query
              if (!querySnapshot.empty) {
                // Iterate through the results (there should be only one in this case)
                querySnapshot.forEach((doc) => {
                  // Get the document reference and update the fields you need
                  const docRef = collectionRef.doc(doc.id);
                  docRef.update({
                    // Update other fields here
                    password: pass_confirmControl?.value,
                    date_updated: new Date(),
                  });
                });
                window.location.href='/login';

              } else {
                console.log('No document with the specified email found.');
              }
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });
          } catch (error) {
            console.error('Error updating document:', error);
          } 
        });
        // window.location.href = '/forgot-password'; 
        
      }else{
        this.msg='Password not match.';
        passControl?.setValue('');
        pass_confirmControl?.setValue('');
      }

    }else{
      this.msg='Please enter information.';
    }
  }
}
