import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

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

  constructor(private firestore: AngularFirestore,private fireAuth: AngularFireAuth) {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }

    if (sessionStorage.getItem('email') !== null){
      var sessionData2 = JSON.parse(sessionStorage.getItem('email')!);
      this.email = sessionData2.email;
    }else{
      window.location.href='/email-verification';
    }
    // this.formGroup.valueChanges.subscribe((changes) => {
    //   // console.log(changes)
    // })
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
      this.msg='Please entere required information.'
    }
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






}
