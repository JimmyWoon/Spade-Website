import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMaterial } from 'src/app/models/material.model';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/compat';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {
  msg: String = '';
  formGroup: FormGroup;
  user_information: any = null;
  material:IMaterial | undefined ;
  selectedFile: File | null = null;
  fileName:string ='';
  fileType:string ='';
  idParam:string|null = null;

  constructor(private route: ActivatedRoute,public storage: AngularFireStorage,private formBuilder: FormBuilder,private firestore: AngularFirestore, private fireAuth: AngularFireAuth)  {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    if(this.user_information.data.role == "Student" || this.user_information == null){
      window.location.href='/';
    }
    this.formGroup = this.formBuilder.group({
      subject : ['',Validators.required],
      title : ['',Validators.required],
      file: [null, Validators.required],
      id: [''],
      description: ['']
    })
  }

  getTeachingMaterialById(documentId: string): Observable<IMaterial> {
    return this.firestore.collection('teaching-material').doc(documentId).valueChanges()
    .pipe(
      map((data: any) => {
        return data as IMaterial;
      })
    );
  }
  ngOnInit(){
    const queryParams = this.route.snapshot.queryParams;
    this.idParam = queryParams['id'];
    if (this.idParam !== null){
      this.fireAuth.signInWithEmailAndPassword(
        this.user_information.data.email ,
      this.user_information.data.password
      ).then(() => {

          this.getTeachingMaterialById(this.idParam!).subscribe((teachingMaterial) => {
            if (teachingMaterial) {
              const data ={
                id: this.idParam,
                fullPath: teachingMaterial.fullPath,
                material_description: teachingMaterial.material_description,
                material_title: teachingMaterial.material_title,
                material_subject: teachingMaterial.material_subject,
              }
              this.material = data as IMaterial;
              this.formGroup.patchValue({
                subject: teachingMaterial.material_subject,
                title: teachingMaterial.material_title,
                description: teachingMaterial.material_description,
                id: teachingMaterial.id
              });            
            } 
          });
      });
    }
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
  submit(){
    const file:File = this.formGroup.controls['file'].value;
    var description = this.formGroup.controls['description'].value;
    var title = this.formGroup.controls['title'].value;
    var subject = this.formGroup.controls['subject'].value;
    var id = this.formGroup.controls['id'].value;

    if (description == null){
      description ='';
    }
    
    if (file !== null && this.formGroup.valid) {
      this.fireAuth.signInWithEmailAndPassword(
        this.user_information.data.email ,
        this.user_information.data.password
      ).then(async() => {
        if (this.idParam !== undefined ){
          'update'
          const storage = getStorage();
          const storageRef = ref(storage, `material/${this.fileName}`);
          const uploadTask = uploadBytes(storageRef, file);

          uploadTask.then((s)=>{
            const fileData = {
              bucket:s.metadata.bucket,
              fullPath: s.metadata.fullPath,
              material_description: description,
              material_filename: this.fileName,
              material_filetype: this.fileType,
              user_id:this.user_information.id,
              material_title:title,
              material_subject:subject,
              date_added:new Date(),
              date_deleted: null,
              date_updated:new Date()
            }
            
            this.firestore.collection("teaching-material").doc(this.idParam!).update({
              bucket:s.metadata.bucket,
              fullPath: s.metadata.fullPath,
              material_description: description,
              material_filename: this.fileName,
              material_filetype: this.fileType,
              material_title:title,
              material_subject:subject,
              date_updated:new Date()
            })
            .then(() => {
              window.location.href="/material-edit-list";
            })
            .catch(error => {
              console.error('Error updating document field:', error);
            });
          },err => {
            console.error(err);
          })
        
        }else{
          'insert'
          // const filePath = `material/${this.fileName}`;
          // const fileRef = this.storage.ref(filePath);

          // const downloadURL = await fileRef.getDownloadURL().toPromise();
          // console.log(`File uploaded to: ${downloadURL}`);

          const storage = getStorage();
          const storageRef = ref(storage, `material/${this.fileName}`);
          
          // /** @type {any} */
          // const metadata = {
          //   contentType: 'application/vnd.microsoft.portable-executable',
          // };
          
          const uploadTask = uploadBytes(storageRef, file);
          

          
          uploadTask.then((s)=>{
            const fileData = {
              bucket:s.metadata.bucket,
              fullPath: s.metadata.fullPath,
              material_description: description,
              material_filename: this.fileName,
              material_filetype: this.fileType,
              user_id:this.user_information.id,
              material_title:title,
              material_subject:subject,
              date_added:new Date(),
              date_deleted: null,
              date_updated:new Date()
            }
            
            this.firestore.collection('teaching-material').add(fileData)
              .then(() =>{
                window.location.href ="/material-list";
              })
              .catch((error) =>{
                console.error('Error occurred: ', error);
              });
  
          },err => {
            console.error(err);
          })
        }  
      });
    } else {
      this.msg = 'Please select a file and fill in required information.';
    }
  }
}
