import { Component} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getStorage, ref, uploadBytes } from "firebase/storage";


@Component({
  selector: 'app-download-edit',
  templateUrl: './download-edit.component.html',
  styleUrls: ['./download-edit.component.scss'],

})
export class DownloadEditComponent{
  msg: String = '';
  formGroup: FormGroup;
  user_information: any = null;
  selectedFile: File | null = null;
  fileName:string ='';
  fileType:string ='';

  constructor(public storage: AngularFireStorage, private formBuilder: FormBuilder, private firestore: AngularFirestore, private fireAuth: AngularFireAuth) {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    if(this.user_information.data.role == "Student" || this.user_information == null){
      window.location.href='/';
    }
    this.formGroup = this.formBuilder.group({
      file: [null, Validators.required],
      description: ['']
    })
  }

  
  getFileExtension(fileName: string): string {
    const parts = fileName.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1];
    }
    return 'Unknown'; // Default to 'Unknown' if no extension found
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.fileName = file.name;
      this.fileType = this.getFileExtension(file.name);
    } else {
      this.fileName = '';
      this.fileType = '';
    }
  }

  submit() {
    const file:File = this.formGroup.controls['file'].value;
    var description = this.formGroup.controls['description'].value;
    if (description == null){
      description ='';
    }
    
    if (file !== null && this.formGroup.valid) {
      this.fireAuth.signInWithEmailAndPassword(
        "jimmyechunwoon@gmail.com",
        "123456"
      ).then(() => {
        const storage = getStorage();
        const storageRef = ref(storage, `spade/${this.fileName}`);
        
        // Create file metadata including the content type
        /** @type {any} */
        const metadata = {
          contentType: 'application/vnd.microsoft.portable-executable',
        };
        
        // Upload the file and metadata
        const uploadTask = uploadBytes(storageRef, file, metadata);

        
        uploadTask.then((s)=>{
          const fileData = {
            bucket:s.metadata.bucket,
            fullPath: s.metadata.fullPath,
            name:s.metadata.name,
            description: description,
            filename: this.fileName,
            filetype: this.fileType,
            user_id:this.user_information.id,
            date_added:new Date(),
            date_deleted: null,
            date_updated:new Date()
          }
          
          this.firestore.collection('spade').add(fileData)
            .then(() =>{
              window.location.href ="/download";
            })
            .catch((error) =>{
              console.error('Error occurred: ', error);
            });

        },err => {
          console.error(err);
        })

  
      });
    } else {
      this.msg = 'Please select a file.';
    }
  }
}
