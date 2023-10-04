import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  msg = '';
  user_information:any = null;
  formGroup: FormGroup;


  constructor(private firestore: AngularFirestore, private fireAuth: AngularFireAuth, private formBuilder:FormBuilder,private el: ElementRef, private renderer: Renderer2){    
    if (sessionStorage.getItem('user') !== null){
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    this.formGroup = this.formBuilder.group({
      username: [this.user_information.data?.username,[Validators.required]],
      old_password: [''],
      new_password: ['']
    })
    this.formGroup.controls['username'].disable();
  }
  editClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    const passBtn = this.el.nativeElement.querySelector('#edit_password');

    this.renderer.setStyle(saveBtn, 'display', 'inline-block');
    this.renderer.setStyle(cancelBtn, 'display', 'inline-block');
    this.renderer.setStyle(passBtn, 'display', 'inline-block');
    this.renderer.setStyle(editBtn, 'display', 'none');
    this.formGroup.controls['username'].enable();

  }
  cancelClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    const passBtn = this.el.nativeElement.querySelector('#edit_password');
    const old_password_div = this.el.nativeElement.querySelector('#old_password_div');
    const new_password_div = this.el.nativeElement.querySelector('#new_password_div');

    
    this.renderer.setStyle(saveBtn, 'display', 'none');
    this.renderer.setStyle(cancelBtn, 'display', 'none');
    this.renderer.setStyle(passBtn, 'display', 'none');
    this.renderer.setStyle(editBtn, 'display', 'inline-block');

    this.renderer.addClass(old_password_div, 'hidden');
    this.renderer.addClass(new_password_div, 'hidden');


    this.formGroup.controls['username'].disable();
    this.formGroup.controls['old_password'].disable();
    this.formGroup.controls['new_password'].disable();
    this.formGroup.controls['username'].setValue(this.user_information.data?.username);
    this.formGroup.controls['old_password'].setValue('');
    this.formGroup.controls['new_password'].setValue('');
  }

  passwordClick(){
    const passBtn = this.el.nativeElement.querySelector('#edit_password');
    const old_password_div = this.el.nativeElement.querySelector('#old_password_div');
    const new_password_div = this.el.nativeElement.querySelector('#new_password_div');
    this.renderer.setStyle(passBtn, 'display', 'none');
    this.formGroup.controls['old_password'].enable();
    this.formGroup.controls['new_password'].enable();
    this.renderer.removeClass(old_password_div, 'hidden');
    this.renderer.removeClass(new_password_div, 'hidden');
  }

  async submit(){
    const username = this.formGroup.controls['username'].value;
    const old_password = this.formGroup.controls['old_password'].value;
    const new_password = this.formGroup.controls['new_password'].value;
    
    // check name have exist
    const collectionRef = this.firestore.collection('user');

    const query = collectionRef.ref
    .where('username', '==', username)
    .where('__name__', '!=', this.user_information.id)
    .where('date_deleted', '==', 'null');

    let existed = false;
    this.fireAuth.signInWithEmailAndPassword(
      "jimmyechunwoon@gmail.com",
      "123456"
    ).then(async () => {
      try {
        const querySnapshot = await query.get();
    
        if (!querySnapshot.empty) {
          existed = true;
        }
      } catch (error) {
        this.msg="Error";
        console.error('Error querying Firestore:', error);
      }
    
      if (existed){
        this.msg='Username exist.';
      }else{
        if(old_password === "" && new_password === ""){
          try {
            const documentRef = this.firestore.collection('user').doc(this.user_information.id);
            await documentRef.update({ 'username': username, 'date_updated': new Date() });
            this.user_information.data.username = username;
            this.user_information.data.date_updated = new Date();
            sessionStorage.setItem('user',JSON.stringify(this.user_information) );
            window.location.href='/profile';

          } catch (error) {
            console.error('Error updating document:', error);
          }
        
        }else{
  
          if(this.user_information.data?.password === old_password ){
            try {
              const documentRef = this.firestore.collection('user').doc(this.user_information.id);
              await documentRef.update({ 'username': username, 'password': new_password, 'date_updated': new Date() });
              this.user_information.data.username = username;
              this.user_information.data.password = new_password;
  
              this.user_information.data.date_updated = new Date();
              sessionStorage.setItem('user',JSON.stringify(this.user_information));
              window.location.href='/profile';

            } catch (error) {
              console.error('Error updating document with password:', error);
            }
    
          }else{
            this.msg = 'Incorrect';
            this.formGroup.controls['username'].setValue(this.user_information.data?.username);
            this.formGroup.controls['old_password'].setValue('');
            this.formGroup.controls['new_password'].setValue('');
            this.cancelClick()
          }
        }
      }
      
  });
  }
}
