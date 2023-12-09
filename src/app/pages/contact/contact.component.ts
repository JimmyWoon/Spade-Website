import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  msg:String ="";
  formGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,private router: Router,private fireAuth: AngularFireAuth,private firesotre:AngularFirestore){
    this.formGroup = this.formBuilder.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      message: ['',Validators.required]
    })
  }
  submit(){
    const nameControl = this.formGroup.get('name');
    const emailControl = this.formGroup.get('email');
    const messageControl = this.formGroup.get('message');

    if (emailControl && messageControl && nameControl && this.formGroup.valid) {

      this.fireAuth.signInWithEmailAndPassword(
        "jimmyechunwoon@gmail.com",
        "123456"
      ).then(() => {
        const data = {
          name: nameControl.value,
          email:emailControl.value,
          message: messageControl.value,
          date_added: new Date()
        }
        this.firesotre.collection('message').add(data)
          .then(() =>{
            this.router.navigate(['/']);
          })
          .catch((error) =>{
            console.error('Error occurred: ', error);
          });
      });
      
    }else{
      this.msg='Please enter valid information.';
    }
  }

}
