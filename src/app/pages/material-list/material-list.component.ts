import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMaterial } from 'src/app/models/material.model';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { environment } from 'src/environment/environment';
import { FileUploadService } from 'service/file-upload.service';


@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.scss']
})
export class MaterialListComponent {
  msg:String = ''
  formGroup: FormGroup;
  selectedFile: File | null = null;
  material_list:IMaterial[] = [];
  fireauth = environment.firebase

  constructor(private fileUploadService: FileUploadService,private storage: AngularFirestore,private firestore: AngularFirestore, private formBuilder: FormBuilder){
    this.formGroup = this.formBuilder.group({
      file: ['',[Validators.required]],
    })
  }
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  submit(){
    if (this.formGroup.valid){

      const app = initializeApp(this.fireauth);
      const auth = getAuth(app);
      signInWithEmailAndPassword(auth, 'jimmyechunwoon@gmail.com', '123456')
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          const file = this.selectedFile;
          if (file) {
            const filePath = 'uploads/' + file.name; // Define your desired storage path
            this.fileUploadService.uploadFile(file, filePath).subscribe((downloadURL) => {
              if (downloadURL) {
                console.log('File uploaded successfully. Download URL:', downloadURL);
              } else {
                console.error('File upload failed.');
              }
            });
          }         
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });

      // if (this.selectedFile) {
      //   const filePath = 'your-upload-folder/' + this.selectedFile.name;
      //   const fileRef = this.storage.ref(filePath);
      //   const task = this.storage.upload(filePath, this.selectedFile);

      //   // You can handle task progress or completion here
      //   task.snapshotChanges().subscribe(
      //     (snapshot) => {
      //       // Handle progress or completion here if needed
      //     },
      //     (error) => {
      //       // Handle errors here if needed
      //     },
      //     () => {
      //       // File upload completed successfully
      //       console.log('File uploaded successfully');
      //     }
      //   );
      // }
    }else{
      this.msg='Plase fill up the required information';
    }
  }
}

