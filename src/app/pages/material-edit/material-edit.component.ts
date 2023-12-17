import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMaterial } from 'src/app/models/material.model';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { ActivatedRoute, withDebugTracing } from '@angular/router';
import * as firebase from 'firebase/compat';
import { Observable, map, switchMap } from 'rxjs';
import { FileUploadService } from 'service/file-upload.service'; 

@Component({
  selector: 'app-material-edit',
  templateUrl: './material-edit.component.html',
  styleUrls: ['./material-edit.component.scss']
})
export class MaterialEditComponent implements OnInit {
  msg: String = '';
  formGroup: FormGroup ;
  user_information: any = null;
  material:IMaterial | undefined ;
  selectedFile: File | null = null;
  fileName:string ='';
  fileType:string ='';
  idParam:string|null | undefined = undefined;


  selectedImages: File[] = [];
  imageUrls: string[] = [];


  constructor(private fileUpload: FileUploadService ,private route: ActivatedRoute,public storage: AngularFireStorage,private formBuilder: FormBuilder,private firestore: AngularFirestore, private fireAuth: AngularFireAuth)  {
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    if(this.user_information.data.role == "Student" || this.user_information == null){
      window.location.href='/';
    }
    this.formGroup = this.formBuilder.group({
      exposure: ['',Validators.required],
      subject : ['',Validators.required],
      title : ['',Validators.required],
      file: ['', Validators.required],
      id: [],
      description: [''],
      images: ['']
    });  
  }


updateImageUrls() {
  this.imageUrls =[];
  this.imageUrls = this.selectedImages.map(image => this.getImageUrl(image));
}
getImageUrl(image: File): string {
  return URL.createObjectURL(image);
}
onImageSelected(event: any) {
  const files = event.target.files;
  // Clear the existing selected images
  if (files.length > 5 ){
    this.msg = "Maximum 5 images allowed.";
    this.selectedImages = [];
    this.imageUrls = [];
    this.formGroup!.get('images')?.setValue(null);
 
  }else{
    this.selectedImages = [];

    // Iterate over the selected files
    for (let i = 0; i < files.length; i++) {
      const file: File = files.item(i);
      if (this.getFileExtension(file.name) === 'jpg' || this.getFileExtension(file.name) === 'png' || this.getFileExtension(file.name) === 'jpeg'){
        // Add the file to the selectedImages array
        this.selectedImages.push(file);
      }else{
        this.msg = "Only jpg, jpeg, png, file can be uploaded.";
        this.selectedImages = [];
        this.imageUrls = [];
        this.formGroup!.get('images')?.setValue('');
        break;
      }
    }
    this.updateImageUrls();
  }
}



getTeachingMaterialById(documentId: string): Observable<IMaterial> {
  // return this.firestore.collection('teaching-material').doc(documentId).valueChanges()
  // .pipe(
  //   map((data: any) => {
  //     return data as IMaterial;
  //   })
  // );
  return this.firestore
  .collection('teaching-material')
  .doc(documentId)
  .snapshotChanges()
  .pipe(
    switchMap((doc) => {
      const material = doc.payload.data() as IMaterial;
      const thumbnailsCollection = this.firestore
        .collection(`teaching-material/${documentId}/thumbnails`)
        .snapshotChanges();

        return thumbnailsCollection.pipe(
          map((thumbnails) => {
            const thumbnailUrls = thumbnails
              .map((thumbnail) => {
                const thumbnailData = thumbnail.payload.doc.data() as {
                  replaced: boolean;
                  downloadUrl: string;
                };
                return thumbnailData;
              })
              .filter((thumbnailData :any) => !thumbnailData.replaced); // Filter out where replaced is true
    
            return { ...material, thumbnail: thumbnailUrls.map(x => x.downloadUrl) } as IMaterial;
          })
        );
    })
  );
}
ngOnInit(){
  try{
    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
    this.user_information.data.password
    );
  }catch{
    window.location.href = '/material-list';
  }

  const queryParams = this.route.snapshot.queryParams;
  this.idParam = queryParams['id'];
  if (this.idParam !== null && this.idParam !== undefined){
        this.getTeachingMaterialById(this.idParam!).subscribe((teachingMaterial) => {
          if (teachingMaterial) {
            // console.log(teachingMaterial);
            const data  ={
              id: this.idParam,
              fullPath: teachingMaterial.fullPath,
              material_description: teachingMaterial.material_description,
              material_title: teachingMaterial.material_title,
              material_subject: teachingMaterial.material_subject,
              exposure: teachingMaterial.exposure,
              thumbnail: teachingMaterial.thumbnail,
              material_file_name:teachingMaterial.material_file_name,
            } 
            this.material = data as IMaterial;
            this.imageUrls = this.material.thumbnail;

            this.formGroup = this.formBuilder.group({
              exposure: [teachingMaterial.exposure,Validators.required],
              subject : [teachingMaterial.material_subject,Validators.required],
              title : [teachingMaterial.material_title,Validators.required],
              file: ['', Validators.required],
              id: [teachingMaterial.id],
              description: [teachingMaterial.material_description],
              images: ['']
            });
          } 
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

      if (this.getFileExtension(file.name) === 'spdx'){
        this.fileName = file.name;
        this.fileType = this.getFileExtension(file.name);
      }else{
        // only spdx file can be uploaded
        this.msg = "Only spdx file can be uploaded.";
        this.selectedFile = null;
        this.formGroup!.get('file')?.setValue('');
   
      }
    } else {
      this.fileName = '';
      this.fileType = '';
      this.formGroup!.get('file')?.setValue('');
    }
  }


  submit(){
    const file:File = this.formGroup.controls['file'].value;
    var description = this.formGroup.controls['description'].value;
    var title = this.formGroup.controls['title'].value;
    var subject = this.formGroup.controls['subject'].value;
    var id = this.formGroup.controls['id'].value;
    var exposure = this.formGroup.controls['exposure'].value;

    if (this.formGroup.valid && file !== null) {

      if (this.idParam !== undefined ){
        'update'
        this.firestore.collection("teaching-material").doc(this.idParam!).update({
          material_description: description,
          material_filename: this.fileName,
          material_filetype: this.fileType,
          material_title:title,
          material_subject:subject,
          date_updated:new Date(),
          exposure: exposure
        })
        .then(() => {
          const storage = getStorage();
          const storageRef = ref(storage, `material/${this.idParam}/${this.fileName}`);
          const uploadTask = uploadBytes(storageRef, file);

          uploadTask.then((s)=>{
            this.firestore.collection("teaching-material").doc(this.idParam!).update({
              bucket:s.metadata.bucket,
              fullPath: s.metadata.fullPath,
            });
            // if no images selected will become no image
            this.fileUpload.ClearPreviousImageReference(this.idParam!);
            this.selectedImages.forEach((img) => {
              this.fileUpload.uploadImage(img, this.idParam!).then(() => {
                  // Continue with other operations or redirect
              }).catch((error) => {
                  console.error('Error occurred during image upload: ', error);
              });
            });
            
          },err => {
            console.error(err);
          })
          window.location.href="/material-edit-list";
        })
        .catch(error => {
          console.error('Error updating document field:', error);
        });      
      
      }else{
        'insert'

        const fileData = {
          material_description: description ,
          material_filename: this.fileName,
          material_filetype: this.fileType,
          user_id:this.user_information.id,
          material_title:title,
          material_subject:subject ,
          date_added:new Date(),
          date_deleted: null,
          date_updated:new Date(),
          exposure:exposure
        }
        
        this.firestore.collection('teaching-material').add(fileData)
          .then((docRef) =>{
            const materialId = docRef.id

            const storage = getStorage();
            const storageRef = ref(storage, `material/${materialId}/${this.fileName}`);
                    
            const uploadTask = uploadBytes(storageRef, file);
          
            uploadTask.then((s)=>{
              this.firestore.collection("teaching-material").doc(materialId).update({
                bucket:s.metadata.bucket,
                fullPath: s.metadata.fullPath,
              }).then(() =>{

              }).catch((err) =>{
                console.log(err);

              });
              // if no images selected will become no image
              this.fileUpload.ClearPreviousImageReference(this.idParam!);
              this.selectedImages.forEach((img) => {
                this.fileUpload.uploadImage(img, materialId).then(() => {
                    // Continue with other operations or redirect
                }).catch((error) => {
                    console.error('Error occurred during image upload: ', error);
                });
              });
              
            },err => {
                this.msg =err;
            })

            window.location.href ="/material-list";
          })
          .catch((error) =>{
            console.error('Error occurred: ', error);
          });        
        }  
    } else {
      this.msg = 'Please select a file and fill in required information.';
    }
  }
}
