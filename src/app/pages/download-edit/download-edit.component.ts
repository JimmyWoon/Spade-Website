import { Component} from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage/';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { uploadBytes } from 'firebase/storage';
import { FileUploadService } from 'service/file-upload.service';



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
  ref: AngularFireStorageReference | undefined;
  task: AngularFireUploadTask | undefined;
  fileName:string ='';
  fileType:string ='';

  constructor(public storage: AngularFireStorage, private formBuilder: FormBuilder, private firestore: AngularFirestore, private fireAuth: AngularFireAuth) {

    
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
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
    const id = Math.random().toString(36).substring(2);
    if (description == null){
      description ='';
    }
    
    if (file !== null && this.formGroup.valid) {
      this.fireAuth.signInWithEmailAndPassword(
        "jimmyechunwoon@gmail.com",
        "123456"
      ).then(() => {
        const file = this.selectedFile;
        this.ref = this.storage.ref(id);
        const metadata = {
          contentType: this.fileType, // Set the content type based on the desired file type
        };


        this.task =this.ref.put(this.formGroup.controls['file'].value,metadata);

        this.task.then((s)=>{
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
