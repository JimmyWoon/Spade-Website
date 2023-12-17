import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  msg = '';
  user_information:any = null;
  formGroup: FormGroup;
  selectedImage: string | ArrayBuffer | null = '/assets/image/user.png'; // Set the default image path
  profilePicture: File | null = null;


  @ViewChild('fileInput') fileInput: ElementRef | undefined;


  constructor(private datePipe : DatePipe, private cookieService: CookieService,private firestore: AngularFirestore, private storage: AngularFireStorage,private fireAuth: AngularFireAuth, private formBuilder:FormBuilder,private el: ElementRef, private renderer: Renderer2){    
    if (sessionStorage.getItem('user') !== null){
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    this.formGroup = this.formBuilder.group({
      username: [this.user_information.data?.username,[Validators.required]],
    })
    this.formGroup.controls['username'].disable();
  }

  async ngOnInit() {
    if (this.user_information.data.dob !== null){
      const milliseconds = this.user_information.data.dob.seconds * 1000 + Math.floor(this.user_information.data.dob.nanoseconds / 1e6);
      const dateObject = new Date(milliseconds);
      this.user_information.data.dob = this.datePipe.transform(dateObject, 'dd/MM/yyyy') || '';
    }

    if (this.user_information.data.profile_picture !== undefined){
      const imagePath = this.user_information.data.profile_picture; // Replace with your image path
    
      const imageRef = this.storage.ref(imagePath);
  
      imageRef.getDownloadURL().subscribe((url: string) => {
        this.selectedImage = url;
      }, (error: any) => {
        // Handle any errors that occurred when retrieving the image
        console.error('Error getting download URL:', error);
      });
    }
  }
  editClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    const passBtn = this.el.nativeElement.querySelector('#edit_password');
    const phtBtn = this.el.nativeElement.querySelector('#edit_photo');

    this.renderer.setStyle(saveBtn, 'display', 'inline-block');
    this.renderer.setStyle(cancelBtn, 'display', 'inline-block');
    this.renderer.setStyle(passBtn, 'display', 'inline-block');
    this.renderer.setStyle(phtBtn, 'visibility', 'visible');
    this.renderer.setStyle(editBtn, 'display', 'none');
    this.formGroup.controls['username'].enable();

  }
  cancelClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    const passBtn = this.el.nativeElement.querySelector('#edit_password');
    const phtBtn = this.el.nativeElement.querySelector('#edit_photo');

    // const old_password_div = this.el.nativeElement.querySelector('#old_password_div');
    // const new_password_div = this.el.nativeElement.querySelector('#new_password_div');

    
    this.renderer.setStyle(saveBtn, 'display', 'none');
    this.renderer.setStyle(cancelBtn, 'display', 'none');
    this.renderer.setStyle(passBtn, 'display', 'none');
    this.renderer.setStyle(phtBtn, 'visibility', 'hidden');

    this.renderer.setStyle(editBtn, 'display', 'inline-block');

    // this.renderer.addClass(old_password_div, 'hidden');
    // this.renderer.addClass(new_password_div, 'hidden');


    this.formGroup.controls['username'].disable();
    // this.formGroup.controls['old_password'].disable();
    // this.formGroup.controls['new_password'].disable();
    this.formGroup.controls['username'].setValue(this.user_information.data?.username);
    // this.formGroup.controls['old_password'].setValue('');
    // this.formGroup.controls['new_password'].setValue('');
  }

  passwordClick(){
    const passBtn = this.el.nativeElement.querySelector('#edit_password');

    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    const phtBtn = this.el.nativeElement.querySelector('#edit_photo');

    // const old_password_div = this.el.nativeElement.querySelector('#old_password_div');
    // const new_password_div = this.el.nativeElement.querySelector('#new_password_div');
    this.renderer.setStyle(passBtn, 'display', 'none');
    this.renderer.setStyle(saveBtn, 'display', 'none');
    this.renderer.setStyle(cancelBtn, 'display', 'none');
    this.renderer.setStyle(phtBtn, 'visibility', 'hidden');

    this.renderer.setStyle(editBtn, 'display', 'inline-block');


    // this.formGroup.controls['old_password'].enable();
    // this.formGroup.controls['new_password'].enable();
    // this.renderer.removeClass(old_password_div, 'hidden');
    // this.renderer.removeClass(new_password_div, 'hidden');

    this.fireAuth.sendPasswordResetEmail(this.user_information.data.email)
    .then(() => {
      this.msg = 'Password reset email sent successfully!';
      this.cookieService.set('reset-email', this.user_information.data.email, 0.5);  
    })  
   
  }

  async submit(){
    const username = this.formGroup.controls['username'].value;
    // const old_password = this.formGroup.controls['old_password'].value;
    // const new_password = this.formGroup.controls['new_password'].value;

    
    // check name have exist
    const collectionRef = this.firestore.collection('user');
    const query = collectionRef.ref
    .where('username', '==', username)
    .where('__name__', '!=', this.user_information.id)
    .where('date_deleted', '==', 'null');

    let existed = false;
    

    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
      this.user_information.data.password
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
          // if(old_password === "" && new_password === ""){
            try {
              const documentRef = this.firestore.collection('user').doc(this.user_information.id);
              await documentRef.update({ 'username': username, 'date_updated': new Date() });
              this.user_information.data.username = username;
              this.user_information.data.date_updated = new Date();

              // Add the file upload logic here
              if (this.profilePicture !== null) {
                const storage = getStorage();
                const uniqueID =   this.generateRandomId(10);
                const storageRef = ref(storage, `profile-picture/${uniqueID}`);
                const uploadTask = uploadBytes(storageRef, this.profilePicture!);

                await uploadTask.then((s) => {
                  if (this.user_information.data.profile_picture !== undefined){
                    const storageRef = this.storage.ref(this.user_information.data.profile_picture);
                    storageRef.delete();
                  }
                  

                  documentRef.update({ 'profile_picture': s.metadata.fullPath, 'date_updated': new Date() , 'profile_name':this.profilePicture?.name, 'profile_filetype': this.profilePicture?.type});
                  this.user_information.data.profile_picture = s.metadata.fullPath;
                  this.user_information.data.profile_name = this.profilePicture?.name;
                  this.user_information.data.profile_filetype = this.profilePicture?.type;
                  this.user_information.data.date_updated = new Date();

                });
              }
              sessionStorage.setItem('user',JSON.stringify(this.user_information) );

              window.location.href='/profile';
  
            } catch (error) {
              console.error('Error updating document:', error);
            }
          
          // }else{
    
            // if(this.user_information.data?.password === old_password ){
            //   try {
            //     const documentRef = this.firestore.collection('user').doc(this.user_information.id);
            //     await documentRef.update({ 'username': username, 'password': new_password, 'date_updated': new Date() });
            //     this.user_information.data.username = username;
            //     this.user_information.data.password = new_password;
    
            //     this.user_information.data.date_updated = new Date();
            //     // Add the file upload logic here
            //     if (this.profilePicture !== null) {
            //       const storage = getStorage();
            //       const uniqueID =   this.generateRandomId(10);
            //       const storageRef = ref(storage, `profile-picture/${uniqueID}`);
            //       const uploadTask = uploadBytes(storageRef, this.profilePicture!);

            //       await uploadTask.then((s) => {
            //         if (this.user_information.data.profile_picture !== undefined){
            //           const storageRef = this.storage.ref(this.user_information.data.profile_picture);
            //           storageRef.delete();
            //         }

            //         documentRef.update({ 'profile_picture': s.metadata.fullPath, 'date_updated': new Date() , 'profile_name':this.profilePicture?.name, 'profile_filetype': this.profilePicture?.type});
            //         this.user_information.data.profile_picture = s.metadata.fullPath;
            //         this.user_information.data.profile_name = this.profilePicture?.name;
            //         this.user_information.data.profile_filetype = this.profilePicture?.type;
            //         this.user_information.data.date_updated = new Date();
            //         sessionStorage.setItem('user',JSON.stringify(this.user_information) );

            //       });
            //     }
            //     sessionStorage.setItem('user',JSON.stringify(this.user_information));
            //     window.location.href='/profile';
  
            //   } catch (error) {
            //     console.error('Error updating document with password:', error);
            //   }
      
            // }else{
            //   this.msg = 'Incorrect';
            //   this.formGroup.controls['username'].setValue(this.user_information.data?.username);
            //   this.formGroup.controls['old_password'].setValue('');
            //   this.formGroup.controls['new_password'].setValue('');
            //   this.cancelClick()
            // }
          // }
        }
    });  
 
  }
  generateRandomId(length:number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }
  
    return randomId;
  }
  

  openFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        this.profilePicture = file;
        this.previewImage(file);
        this.msg = '';
      }else{
        this.msg = 'Please select file in image format';
      }
    }
  }

  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.selectedImage = e.target?.result!;
    };
    reader.readAsDataURL(file);
  }
}
